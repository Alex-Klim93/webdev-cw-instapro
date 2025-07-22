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
            <!-- остальная разметка поста -->
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

  // Обработчики кликов
  document.querySelectorAll('.post-header').forEach((userEl) => {
    userEl.addEventListener('click', () => {
      goToPage(USER_POSTS_PAGE, { userId: userEl.dataset.userId })
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
          renderPostsPageComponent({ appEl }) // Ре-рендерим текущую страницу
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
