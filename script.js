document.addEventListener("DOMContentLoaded", () => {
  // Theme Toggle
  const themeToggle = document.getElementById("theme-toggle")
  const body = document.body

  // Check for saved theme preference
  const savedTheme = localStorage.getItem("theme")
  if (savedTheme) {
    body.setAttribute("data-theme", savedTheme)
  }

  themeToggle.addEventListener("click", () => {
    if (body.getAttribute("data-theme") === "dark") {
      body.removeAttribute("data-theme")
      localStorage.setItem("theme", "light")
    } else {
      body.setAttribute("data-theme", "dark")
      localStorage.setItem("theme", "dark")
    }
  })

  // Smooth Scroll for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        const headerOffset = 80
        const elementPosition = target.getBoundingClientRect().top
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        })
      }
    })
  })

  // Scroll Animation (Simple Fade In)
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  const sections = document.querySelectorAll("section")
  sections.forEach((section) => {
    section.style.opacity = "0"
    section.style.transform = "translateY(20px)"
    section.style.transition = "opacity 0.5s ease-out, transform 0.5s ease-out"
    observer.observe(section)
  })

  // Gallery Auto-Scroll & Modal
  const track = document.getElementById("gallery-track")
  if (track) {
    // Clone items for infinite scroll
    const items = track.innerHTML
    track.innerHTML += items

    let scrollAmount = 0
    let scrollInterval

    const startScroll = () => {
      scrollInterval = setInterval(() => {
        scrollAmount += 1
        // Reset scroll if we reached the end of the original set of items
        // track.scrollWidth / 2 is the exact width of the original items
        if (scrollAmount >= track.scrollWidth / 2) {
          scrollAmount = 0
        }
        track.style.transform = `translateX(-${scrollAmount}px)`
      }, 20) // Adjust speed
    }

    const stopScroll = () => {
      clearInterval(scrollInterval)
    }

    startScroll()

    // Pause scrolling on hover or touch
    track.addEventListener("mouseenter", stopScroll)
    track.addEventListener("mouseleave", startScroll)
    track.addEventListener("touchstart", stopScroll)
    track.addEventListener("touchend", startScroll)

    const prevBtn = document.getElementById("gallery-prev")
    const nextBtn = document.getElementById("gallery-next")

    const manualScroll = (direction) => {
      stopScroll()
      const cardWidth = 352 // 320px width + 32px gap (2rem)

      if (direction === "next") {
        scrollAmount += cardWidth
      } else {
        scrollAmount -= cardWidth
      }

      if (scrollAmount >= track.scrollWidth / 2) {
        scrollAmount = scrollAmount % (track.scrollWidth / 2)
      } else if (scrollAmount < 0) {
        scrollAmount = track.scrollWidth / 2 + scrollAmount
      }

      track.style.transition = "transform 0.3s ease"
      track.style.transform = `translateX(-${scrollAmount}px)`

      setTimeout(() => {
        track.style.transition = "none"
        startScroll()
      }, 300)
    }

    if (prevBtn && nextBtn) {
      prevBtn.addEventListener("mouseenter", stopScroll)
      prevBtn.addEventListener("mouseleave", startScroll)
      nextBtn.addEventListener("mouseenter", stopScroll)
      nextBtn.addEventListener("mouseleave", startScroll)

      prevBtn.addEventListener("click", () => manualScroll("prev"))
      nextBtn.addEventListener("click", () => manualScroll("next"))
    }
  }

  // Modal Logic
  const modal = document.getElementById("gallery-modal")
  const closeBtn = document.getElementById("close-modal")
  const modalMedia = document.getElementById("modal-media-container")
  const modalTitle = document.getElementById("modal-title")
  const modalDesc = document.getElementById("modal-description")

  if (modal) {
    // Since we duplicated items, we use event delegation on the track instead
    if (track) {
      track.addEventListener("click", (e) => {
        const item = e.target.closest(".gallery-item")
        if (item) {
          const mediaHtml = item.querySelector(".gallery-media").innerHTML
          const title = item.querySelector(".gallery-info h3").innerText
          const desc = item.querySelector(".gallery-info p").innerText

          // Populate modal
          modalMedia.innerHTML = mediaHtml
          modalTitle.innerText = title
          modalDesc.innerText = desc

          // Show modal
          modal.classList.add("show")
        }
      })
    }

    const closeModal = () => {
      modal.classList.remove("show")
      // Remove video/iframe after animation finishes
      setTimeout(() => {
        modalMedia.innerHTML = ""
      }, 300)
    }

    closeBtn.addEventListener("click", closeModal)
    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal()
      }
    })
  }
})
