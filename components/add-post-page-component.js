// Добавляем в начало файла add-post-page-component.js
import { renderHeaderComponent } from './header-component.js'
import { renderUploadImageComponent } from './upload-image-component.js'

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  // Функция рендеринга страницы добавления поста
  const render = () => {
    let imageUrl = '' // Переменная для хранения URL загруженного изображения

    // HTML-разметка страницы
    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div> <!-- Контейнер для шапки -->
      <div class="form">
        <h3 class="form-title">Добавить пост</h3> <!-- Заголовок формы -->
        <div class="form-inputs">
          <div class="upload-image-container"></div> <!-- Контейнер для загрузки изображения -->
          <textarea 
            id="description-input" 
            class="input textarea" 
            rows="4" 
            placeholder="Описание изображения"
          ></textarea> <!-- Поле для ввода описания -->
          <button class="button" id="add-button">Добавить</button> <!-- Кнопка отправки -->
        </div>
      </div>
    </div>
    `

    appEl.innerHTML = appHtml // Вставляем разметку в DOM

    // Рендерим шапку страницы
    renderHeaderComponent({
      element: document.querySelector('.header-container'),
    })

    // Инициализируем компонент загрузки изображения
    renderUploadImageComponent({
      element: document.querySelector('.upload-image-container'),
      onImageUrlChange(newImageUrl) {
        // Колбэк, вызываемый при изменении URL изображения
        imageUrl = newImageUrl
      },
    })

    // Обработчик клика по кнопке "Добавить"
    document.getElementById('add-button').addEventListener('click', () => {
      const description = document
        .getElementById('description-input')
        .value.trim()

      // Валидация формы
      if (!description) {
        alert('Введите описание изображения')
        return
      }

      if (!imageUrl) {
        alert('Не выбрано изображение')
        return
      }

      // Вызываем переданный колбэк с данными поста
      onAddPostClick({
        description,
        imageUrl,
      })
    })
  }

  render() // Первоначальный рендеринг страницы
}
