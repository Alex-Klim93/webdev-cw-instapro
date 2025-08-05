// posts-page-component.js
import { USER_POSTS_PAGE } from '../routes.js'
import { renderHeaderComponent } from './header-component.js'
import { posts, goToPage, user } from '../index.js'
import { likePost, dislikePost } from '../api.js'

function generateLikesText(likes, isLiked = false) {
  if (likes.length === 0) return 'Нравится: <strong>0</strong>'

  // Если лайков нет (или они были убраны), но isLiked=true, это ошибка состояния
  if (likes.length === 0 && isLiked) {
    return 'Нравится: <strong>0</strong>'
  }

  if (likes.length === 1) return `Нравится: <strong>${likes[0].name}</strong>`
  return `Нравится: <strong>${likes[likes.length - 1].name}</strong> и <strong>еще ${likes.length - 1}</strong>`
}

export function renderPostsPageComponent({ appEl }) {
  const urlParams = new URLSearchParams(window.location.search)
  const userId = urlParams.get('userId')

  let userName = ''
  if (userId && posts.length > 0) {
    const userPost = posts.find((post) => post.user.id === userId)
    if (userPost) userName = userPost.user.name
  }

  const appHtml = `
  <div class="page-container">
    <div class="header-container"></div>
    ${userId ? `<h2 class="user-posts-title">Посты пользователя ${userName}</h2>` : ''}
    <ul class="posts">
      ${posts
        .map(
          (post, index) => `
        <li class="post" data-post-id="${post.id}" data-index="${index}">
          <div class="post-header" data-user-id="${post.user.id}">
            <img src="${post.user.imageUrl}" class="post-header__user-image">
            <p class="post-header__user-name">${post.user.name}</p>
          </div>
          <div class="post-image-container">
            <img class="post-image" src="${post.imageUrl}">
          </div>
          <div class="post-footer">
            <div class="post-likes">
              <button data-post-id="${post.id}" data-index="${index}" class="like-button">
                <img src="${post.isLiked ? './assets/images/like-active.svg' : './assets/images/like-not-active.svg'}" data-index="${index}">
              </button>
              <p class="post-likes-text" data-index="${index}">
                ${generateLikesText(post.likes, post.isLiked)}
              </p>
            </div>
            <p class="post-text">
              <span class="user-name">${post.user.name}</span>
              ${post.description}
            </p>
            <p class="post-date">
              ${new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        </li>
      `
        )
        .join('')}
    </ul>
  </div>
  `

  appEl.innerHTML = appHtml

  renderHeaderComponent({
    element: document.querySelector('.header-container'),
  })

  // Обработчик клика по имени пользователя
  document.querySelectorAll('.post-header, .user-name').forEach((userEl) => {
    userEl.addEventListener('click', (e) => {
      e.stopPropagation()
      const userId = userEl.closest('.post')?.querySelector('.post-header')
        ?.dataset?.userId
      if (userId) {
        goToPage(USER_POSTS_PAGE, { userId })
      }
    })
  })

  // Обработчик лайков
  document.querySelectorAll('.like-button').forEach((likeButton) => {
    likeButton.addEventListener('click', async () => {
      try {
        if (!user) {
          alert('Для лайков нужно авторизоваться')
          goToPage(AUTH_PAGE)
          return
        }

        const postId = likeButton.dataset.postId
        const postIndex = likeButton.dataset.index
        const currentPost = posts[postIndex]

        // Оптимистичное обновление UI
        const likeImg = document.querySelector(`img[data-index="${postIndex}"]`)
        const likesText = document.querySelector(
          `.post-likes-text[data-index="${postIndex}"]`
        )

        const isLiked = !currentPost.isLiked
        likeImg.src = isLiked
          ? './assets/images/like-active.svg'
          : './assets/images/like-not-active.svg'

        const updatedLikes = isLiked
          ? [...currentPost.likes, { id: user.id, name: user.name }]
          : currentPost.likes.filter((like) => like.id !== user.id)

        likesText.innerHTML = generateLikesText(updatedLikes, isLiked)

        // Отправка запроса на сервер
        const response = await (isLiked ? likePost : dislikePost)({
          token: `Bearer ${user.token}`,
          postId,
        })

        // Обновляем конкретный пост в глобальном массиве
        posts[postIndex] = response.post
      } catch (error) {
        console.error('Ошибка лайка:', error)
        // В случае ошибки перерисовываем компонент
        renderPostsPageComponent({ appEl })
      }
    })
  })
}
