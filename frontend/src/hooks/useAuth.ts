import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import { LoginForm, RegisterForm } from '@/types'

export function useAuth() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user, isAuthenticated, setAuth, clearAuth, setLoading } = useAuthStore()

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginForm) => authApi.login(credentials),
    onMutate: () => setLoading(true),
    onSuccess: (response) => {
      const { access_token, user } = response.data
      setAuth(user, access_token)
      toast.success('Успешный вход в систему')
      router.push('/admin')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Ошибка входа в систему')
      setLoading(false)
    },
  })

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (userData: RegisterForm) => authApi.register(userData),
    onSuccess: () => {
      toast.success('Пользователь успешно создан')
      router.push('/login')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Ошибка регистрации')
    },
  })

  // Profile query
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => authApi.profile(),
    enabled: isAuthenticated && !!user,
    retry: false,
    onError: () => {
      clearAuth()
    },
  })

  // Logout function
  const logout = () => {
    clearAuth()
    queryClient.clear()
    toast.success('Вы вышли из системы')
    router.push('/')
  }

  return {
    user,
    isAuthenticated,
    isLoading: loginMutation.isPending || registerMutation.isPending,
    isProfileLoading,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    profile: profile?.data,
  }
}