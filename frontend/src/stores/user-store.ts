import { create } from "zustand";
import EteAPI from "../utils/api-utils";


type UserStore = {
	isLogedIn: boolean
	isCheckingToken: boolean
	name: string
	username: string

	login: (username: string, password: string) => Promise<void>
	logout: () => Promise<void>
	checkAuth: () => Promise<void>
	register: (name: string, username: string, password: string) => Promise<void>
}



const useUser = create<UserStore>((set) => ({
	name: "",
	username: "",
	isLogedIn: false, // probably redundant, but more explicit
	isCheckingToken: false,


	async login(username: string, password: string) {
		const userData = await EteAPI.login(username, password)
		set({ name: userData.name, username: userData.username, isLogedIn: true })
	},


	async logout() {
		await EteAPI.logout()
		set({ name: "", username: "", isLogedIn: false })
	},


	async register(name: string, username: string, password: string) {
		const userData = await EteAPI.register(name, username, password)
		set({ name: userData.name, username: userData.username, isLogedIn: true })
	},


	async checkAuth() {
		set({ isCheckingToken: true })
		try {
			const { name, username } = await EteAPI.checkAuth()
			set({ name, username, isLogedIn: true })
		}
		finally {
			set({ isCheckingToken: false })
		}
	},
}));


// Check token on site load
useUser.getState().checkAuth();



export default useUser
