import { apiRequest } from './apiService'

const STORAGE_KEY = 'eda_user'
const TOKEN_KEY = 'eda_token'

let current = null

function persist(user){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(user)) }catch(e){}
}

function restore(){
  if(current) return current
  try{
    const raw = localStorage.getItem(STORAGE_KEY)
    if(raw){
      current = JSON.parse(raw)
      return current
    }
  }catch(e){}
  return null
}

export function loginAsEmployee(user){
  return login(user.email, user.password, 'employee')
}

export function loginAsHR(user){
  return login(user.email, user.password, 'hr')
}

async function login(email, password, expectedRole) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  })

  if (data.user.role !== expectedRole) {
    throw new Error(`This account is not an ${expectedRole} account`)
  }

  current = data.user
  localStorage.setItem(TOKEN_KEY, data.token)
  persist(current)
  return current
}

export function logout(){
  current = null
  try{
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(TOKEN_KEY)
  }catch(e){}
}

export function getCurrentUser(){
  return restore()
}

export async function register(user){
  await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(user)
  })
  return login(user.email, user.password, 'employee')
}
