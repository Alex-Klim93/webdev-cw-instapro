import { USER_POSTS_PAGE } from '../routes.js'
import { renderHeaderComponent } from './header-component.js'
import { posts, goToPage, user } from '../index.js'
import { likePost, dislikePost } from '../api.js'

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
            (post) => `
          <li class="post">
            <div class="post-header" data-user-id="${post.user.id}">
              <img src="${post.user.imageUrl}" class="post-header__user-image">
              <p class="post-header__user-name">${post.user.name}</p>
            </div>
            <div class="post-image-container">
              <img class="post-image" src="${post.imageUrl}">
            </div>
            <div class="post-footer">
              <div class="post-likes">
                <button data-post-id="${post.id}" class="like-button">
                  <img src="${post.isLiked ? './assets/images/like-active.svg' : './assets/images/like-not-active.svg'}">
                </button>
                <p class="post-likes-text">
                  Нравится: <strong>${post.likes.length > 0 ? post.likes[post.likes.length - 1].name : '0'}</strong>
                  ${post.likes.length > 1 ? `и <strong>еще ${post.likes.length - 1}</strong>` : ''}
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

  // Обработчик клика по имени пользователя - переход на страницу его постов
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

  document.querySelectorAll('.like-button').forEach((likeButton) => {
    likeButton.addEventListener('click', () => {
      if (!user) {
        alert('Для лайков нужно авторизоваться')
        goToPage(AUTH_PAGE)
        return
      }

      const token = user ? `Bearer ${user.token}` : undefined
      const postId = likeButton.dataset.postId
      const post = posts.find((p) => p.id === postId)

      const apiCall = post.isLiked ? dislikePost : likePost

      apiCall({ token, postId })
        .then((response) => {
          posts = posts.map((p) => (p.id === postId ? response.post : p))
          renderPostsPageComponent({ appEl })
        })
        .catch((error) => {
          console.error(
            `Ошибка ${post.isLiked ? 'снятия' : 'установки'} лайка:`,
            error
          )
          alert(error.message)
        })
    })
  })
}
