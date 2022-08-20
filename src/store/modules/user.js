import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter, asyncRoutes, anyRoutes, constantRoutes } from '@/router'
import router from '@/router'

const getDefaultState = () => {
    return {
        token: getToken(),
        name: '',
        avatar: '',
        routes: [],
        buttons: [],
        roles: [],
        // 异步路由与服务器返回的数据进行对比
        resultAsyncRoutes: [],
        // 常量，任意，异步三者合并
        resultAllRoutes: []
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState())
    },
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    // 存储用户信息
    SET_USERINFO: (state, userInfo) => {
        // 用户名
        state.name = userInfo.name;
        //  用户头像
        state.avatar = userInfo.avatar;
        // 菜单权限标记
        state.routes = userInfo.routes;
        // 按钮权限标记
        state.buttons = userInfo.buttons;
        // 角色信息
        state.roles = userInfo.roles;
    },
    SET_RESULTASYNCROUTES: (state, asyncRoutes) => {
        // 在vuex中保存计算完的异步路由
        state.resultAsyncRoutes = asyncRoutes;
        // 将所有路由进行合并
        state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes, anyRoutes);
        // 给路由器添加新路由
        router.addRoutes(state.resultAllRoutes)
    }

}

const actions = {
    // user login
    login({ commit }, userInfo) {
        const { username, password } = userInfo
        return new Promise((resolve, reject) => {
            login({ username: username.trim(), password: password }).then(response => {
                const { data } = response
                commit('SET_TOKEN', data.token)
                setToken(data.token)
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // get user info
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            // 获取用户信息
            getInfo(state.token).then(response => {
                const { data } = response
                //  将信息全部存储到vuex仓库
                commit('SET_USERINFO', data)
                commit('SET_RESULTASYNCROUTES', computedAsyncRoutes(asyncRoutes, data.routes))
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // user logout
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            logout(state.token).then(() => {
                removeToken() // must remove  token  first
                resetRouter()
                commit('RESET_STATE')
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // remove token
    resetToken({ commit }) {
        return new Promise(resolve => {
            removeToken() // must remove  token  first
            commit('RESET_STATE')
            resolve()
        })
    }
}
const computedAsyncRoutes = (asyncRoutes, routes) => {
    return asyncRoutes.filter((item) => {
        if (routes.indexOf(item.name) != -1) {
            if (item.children && item.children.length) {
                item.children = computedAsyncRoutes(item.children, routes)
            }
            return true
        }
    })
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}