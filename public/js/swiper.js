 
 // This for Main window slider
 var swiper = new Swiper(".slide-swp", {
  effect: 'coverflow',
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: 'auto',
  coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 100,
      modifier: 1, // Adjust this value to control the size difference
      slideShadows: false,
  },
    pagination: {
      el: ".swiper-pagination",
      dynamicBullests: true,
      clickable: true
    },
    autoplay: {
      delay: 2500,
    },loop: true
  });



  
  // This for on Sale section slider
  var swiper = new Swiper(".sale_sec", {
    // pagination: {
    //   el: ".swiper-pagination",  // Specifies the pagination element.
    //   dynamicBullets: true,      // Bullets will change dynamically.
    //   clickable: true            // Bullets can be clicked for navigation.
    // },
    slidesPerView: 5,            // Shows 5 slides (products) at a time.
    spaceBetween: 30,            // Sets a 30px space between slides.
    // autoplay: {
    //   delay: 3500,               // Automatically moves to the next slide after 3.5 seconds.
    // },
    navigation: {
      nextEl: ".swiper-button-next",   // Navigation for next slide.
      prevEl: ".swiper-button-prev"    // Navigation for previous slide.
    },
    // loop: true,    
    breakpoints:{
      1600: {
        slidesPerView:5,
      }, 1200: {
        slidesPerView:4,
        spaceBetween: 20
      },
      700: {
        slidesPerView:3,
        spaceBetween: 15
      }, 300: {
        slidesPerView:2,
        spaceBetween: 10
      }, 100: {
        slidesPerView:2,
        spaceBetween: 10
      },
    }                         // Enables continuous looping of slides.
  });
  
  // This for the last 2 section
  var swiper = new Swiper(".product_swip", {
    slidesPerView: 3,            // Shows 5 slides (products) at a time.
    spaceBetween: 30,            // Sets a 30px space between slides.
    autoplay: {
      delay: 3500,               // Automatically moves to the next slide after 3.5 seconds.
    },
    navigation: {
      nextEl: ".swiper-button-next",   // Navigation for next slide.
      prevEl: ".swiper-button-prev"    // Navigation for previous slide.
    },
    loop: true,    
    breakpoints:{
      1600: {
        slidesPerView:4,
      }, 1200: {
        slidesPerView:3,
        // spaceBetween: 20
      }, 900: {
        slidesPerView:2,
        // spaceBetween: 10
      },
      700: {
        slidesPerView:3,
        // spaceBetween: 15
      }, 300: {
        slidesPerView:2,
        spaceBetween: 10
      }, 100: {
        slidesPerView:2,
        spaceBetween: 10
      },
    }                     // Enables continuous looping of slides.
  });


  

