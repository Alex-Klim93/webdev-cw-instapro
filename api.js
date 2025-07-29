// Замени на свой, чтобы получить независимый от других набор данных.
// "боевая" версия инстапро лежит в ключе prod
const personalKey = 'Alex-Klim93'
const baseHost = 'https://wedev-api.sky.pro' // Изменено с 'https://webdev-hw-api.vercel.app'
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`

// export function getPosts({ token }) {
//   return fetch(postsHost, {
//     method: 'GET',
//     headers: {
//       Authorization: token,
//     },
//   })
//     .then((response) => {
//       if (response.status === 401) {
//         throw new Error('Нет авторизации')
//       }

//       return response.json()
//     })
//     .then((data) => {
//       return data.posts
//     })
// }

export function getPosts({ token }) {
  return fetch(postsHost, {
    method: 'GET',
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error('Нет авторизации')
      }
      if (!response.ok) {
        throw new Error('Ошибка при загрузке постов')
      }
      return response.json()
    })
    .then((data) => {
      return data.posts // Теперь API возвращает объект с полем posts
    })
}
export function registerUser({ login, password, name, imageUrl }) {
  return fetch(baseHost + '/api/user', {
    method: 'POST',
    body: JSON.stringify({
      login,
      password,
      name,
      imageUrl,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error('Такой пользователь уже существует')
    }
    return response.json()
  })
}

export function loginUser({ login, password }) {
  return fetch(baseHost + '/api/user/login', {
    method: 'POST',
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error('Неверный логин или пароль')
    }
    return response.json()
  })
}

// Загружает картинку в облако, возвращает url загруженной картинки
export function uploadImage({ file }) {
  const data = new FormData()
  data.append('file', file)

  return fetch(baseHost + '/api/upload/image', {
    method: 'POST',
    body: data,
  }).then((response) => {
    return response.json()
  })
}

export function addPost({ token, description, imageUrl }) {
  return fetch(postsHost, {
    method: 'POST',
    headers: {
      Authorization: token, // Передаем токен в заголовке
    },
    body: JSON.stringify({
      // Преобразуем данные в JSON
      description,
      imageUrl,
    }),
  }).then((response) => {
    // Обрабатываем возможные ошибки
    if (response.status === 401) {
      throw new Error('Нет авторизации')
    }
    if (response.status === 400) {
      throw new Error('Неверные данные поста')
    }
    return response.json() // Парсим JSON ответа
  })
}

export function getUserPosts({ token, userId }) {
  return fetch(`${postsHost}/user-posts/${userId}`, {
    method: 'GET',
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error('Нет авторизации')
      }
      if (!response.ok) {
        throw new Error('Ошибка при загрузке постов пользователя')
      }
      return response.json()
    })
    .then((data) => {
      return data.posts
    })
    .catch((error) => {
      console.error('Ошибка при загрузке постов пользователя:', error)
      throw error
    })
}

// Добавляем в api.js
export function likePost({ token, postId }) {
  return fetch(`${postsHost}/${postId}/like`, {
    method: 'POST',
    headers: {
      Authorization: token,
    },
  }).then((response) => {
    if (response.status === 401) {
      throw new Error('Нет авторизации')
    }
    return response.json()
  })
}

export function dislikePost({ token, postId }) {
  return fetch(`${postsHost}/${postId}/dislike`, {
    method: 'POST',
    headers: {
      Authorization: token,
    },
  }).then((response) => {
    if (response.status === 401) {
      throw new Error('Нет авторизации')
    }
    return response.json()
  })
}
