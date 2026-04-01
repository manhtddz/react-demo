export type User = {
    id: number
    name: string
    email: string
    password: string
}

export type PublicUser = Omit<User, 'password'>