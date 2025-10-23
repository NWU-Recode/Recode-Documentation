import DefaultTheme from 'vitepress/theme'
import { onMounted, onUpdated, watch } from 'vue'
import { useRoute } from 'vitepress'
import './theme.css'

export default {
    ...DefaultTheme,
    setup() {
        const route = useRoute()

        const setupZoomableImages = () => {
            setTimeout(() => {
                const zoomableImages = document.querySelectorAll('img')
                let overlay = document.querySelector('.image-overlay')

                if (!overlay) {
                    overlay = document.createElement('div')
                    overlay.classList.add('image-overlay')
                    document.body.appendChild(overlay)
                }

                zoomableImages.forEach((img) => {
                    img.classList.add('zoomable')

                    img.addEventListener('click', function () {
                        if (this.classList.contains('zoomed')) {
                            // Zoom out
                            this.classList.remove('zoomed')
                            this.style.width = ''
                            this.style.height = ''
                            this.style.top = ''
                            this.style.left = ''
                            this.style.position = ''
                            overlay.style.display = 'none'
                        } else {
                            // Zoom in
                            zoomableImages.forEach((otherImg) => {
                                otherImg.classList.remove('zoomed')
                                otherImg.style.width = ''
                                otherImg.style.height = ''
                                otherImg.style.top = ''
                                otherImg.style.left = ''
                                otherImg.style.position = ''
                            })

                            this.classList.add('zoomed')
                            overlay.style.display = 'block'

                            const aspectRatio = this.naturalWidth / this.naturalHeight
                            const windowWidth = window.innerWidth
                            const windowHeight = window.innerHeight
                            let width, height, top, left

                            if (aspectRatio > 1) {
                                width = Math.min(windowWidth * 0.8, this.naturalWidth)
                                height = width / aspectRatio
                            } else {
                                height = Math.min(windowHeight * 0.8, this.naturalHeight)
                                width = height * aspectRatio
                            }

                            top = (windowHeight - height) / 2 + 'px'
                            left = (windowWidth - width) / 2 + 'px'

                            this.style.position = 'fixed'
                            this.style.width = `${width}px`
                            this.style.height = `${height}px`
                            this.style.top = top
                            this.style.left = left
                        }
                    })

                    overlay.addEventListener('click', () => {
                        zoomableImages.forEach((otherImg) => {
                            otherImg.classList.remove('zoomed')
                            otherImg.style.width = ''
                            otherImg.style.height = ''
                            otherImg.style.top = ''
                            otherImg.style.left = ''
                            otherImg.style.position = ''
                        })
                        overlay.style.display = 'none'
                    })
                })
            }, 500)
        }

        onMounted(setupZoomableImages)
        onUpdated(setupZoomableImages)
        watch(route, () => setupZoomableImages())
    }
}