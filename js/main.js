// Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
      apiKey: "AIzaSyDo_KQuhBUjM8GHEvJb6LPLG5KQ0TkyzPI",
      authDomain: "pika-pika-65066.firebaseapp.com",
      databaseURL: "https://pika-pika-65066.firebaseio.com",
      projectId: "pika-pika-65066",
      storageBucket: "pika-pika-65066.appspot.com",
      messagingSenderId: "589415866566",
      appId: "1:589415866566:web:2d7b064b706d409c5ab7c7",
      measurementId: "G-VMKN32RZLM"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    // Создаем переменную, в которую положим кнопку меню
    let menuToggle = document.querySelector('#menu-toggle');
    // Создаем переменную, в которую положим меню
    let menu = document.querySelector('.sidebar');

const regExpEmail = /^\w+@\w+\.\w{2,}$/;
const loginElement = document.querySelector('.login');
const loginForm = document.querySelector('.login-form');
const emailInput = document.querySelector('.login-email');
const passInput = document.querySelector('.login-password');
const loginSignup = document.querySelector('.login-signup');
const loginSignin = document.querySelector('.login-signin');
const loginForget = document.querySelector('.login-forget');
const userElem = document.querySelector('.user');
const userNameElem = document.querySelector('.user-name');
const exitBtn = document.querySelector('.exit');
const editElem = document.querySelector('.edit');
const editContainer = document.querySelector('.edit-container');
const editUsername = document.querySelector('.edit-username');
const editPhotoURL = document.querySelector('.edit-photo');
const userAvatarElem = document.querySelector('.user-avatar');
const postWrap = document.querySelector('.posts');

const buttonNewPost = document.querySelector('.button-new-post');
const addPostElem = document.querySelector('.add-post');
const Default_photo = userAvatarElem.src;

const setUsers = {
  user: null,
  initUser(handler){
    firebase.auth().onAuthStateChanged(user => {
      if(user){
        this.user = user;
      }else{
        this.user = null;
      }
      if(handler){
        handler();
      }
    });
  },
  logIn(email, password, handler){

    if(!regExpEmail.test(email)){
      alert('Почта не валидна');
      return;
    }
    firebase.auth()
    .signInWithEmailAndPassword(email, password)
    .catch((err) => {
      // Handle Errors here.
      const errCode = err.code;
      const errMessage = err.message;
      if(errCode === 'auth/wrong-password'){
        console.log(errMessage);
        alert('Неверный пароль');
      }else if(errCode === 'auth/user-not-found'){
        console.log(errMessage);
        alert('Пользователь не найден');
      }else{
        alert(errMessage);
      }
      console.log(err);
      // ...
    });
  },
  logOut(){
  
  firebase.auth().signOut();
  },
  signUp(email, password, handler){

    if(!regExpEmail.test(email)){
        alert('Почта не валидна');
        return;
    }
    if(!email.trim() || !password.trim()){
      alert('Введите данные');
      return;
    }

    firebase.auth()
    .createUserWithEmailAndPassword(email, password)
    .then(data => {
      this.editUser(email.substring(0, email.indexOf('@')), null, handler);
    })
    .catch(err => {
      const errCode = err.code;
      const errMessage = err.message;
      if(errCode === 'auth/weak-password'){
        console.log(errMessage);
        alert('Слабый пароль');
      }else if(errCode === 'auth/email-already-in-use'){
        console.log(errMessage);
        alert('Этот имейл уже используется');
      }else{
        alert(errMessage);
      }


      console.log(err);
    });
    
  },
  editUser(displayName, photoURL, handler){
    const user = firebase.auth().currentUser;

    if(displayName){
      if(photoURL){
        user.updateProfile({
          displayName,
          photoURL,
        }).then(handler);
      }else{
        user.updateProfile({
          displayName
        }).then(handler);
      }
    }
    
  },
  sendForget(email){
    firebase.auth().sendPasswordResetEmail(email)
    .then(() => {
      alert('Письмо отправлено')
      .catch(err => {
        console.log(err);
      })
    })
  }
  // getUser(email){
  //   return listUsers.find((item) => {
  //     return item.email === email;
  //   })
  // },
  
  // authorizedUser(user){
  //   this.user = user;
  // }
};

loginForget.addEventListener('click', e => {
  e.preventDefault();
  setUsers.sendForget(emailInput.value);
  emailInput.value.reset();
})

const setPosts = {
  allPosts: [
    {
      title: 'Заголовок поста',
      text: 'херня собача',
      tags: ['свежее', 'новое', 'горячее', 'мое', 'случайность'],
      author: {displayName: 'vadim', photo: 'https://veselka.mobi/16sep16/news1.jpg'},
      date: '11.11.2020, 20:00:00',
      like: 15,
      comments: 5,
    },
    {
      title: 'Заголовок поста 2',
      text: 'щось дальше',
      tags: ['свежее', 'новое', 'случайность'],
      author: {displayName: 'kate', photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSNNdR4u-pFLLZPNuUzDaVI_uSudZCN24UpXw&usqp=CAU'},
      date: '11.11.2020, 21:00:00',
      like: 55,
      comments: 15,
    },
    
  ],
  addPost(title, text, tags, handler){

    const user = firebase.auth().currentUser;

    this.allPosts.unshift({
      id:`postID${(+new Date()).toString(16)}-${user.uid}`,
      title,
      text,
      tags: tags.split(',').map(item => item.trim()),
      author: {
        displayName: setUsers.user.displayName,
        photo: setUsers.user.photoURL,
      },
      date: new Date().toLocaleString(),
      like: 0,
      comments: 0,
    })

    firebase.database().ref('post').set(this.allPosts)
    .then(() => this.getPosts(handler));


  },
  getPosts(handler){
    firebase.database().ref('post').on('value', snapshot => {
      this.allPosts = snapshot.val() || [];
      handler();
    })
  }

}

const toggleAuthDOM = () =>{
  const user = setUsers.user;
  if(user){
    loginElement.style.display = 'none';
    userElem.style.display = '';
    userNameElem.textContent = user.displayName;
    userAvatarElem.src = user.photoURL || Default_photo;
    buttonNewPost.classList.add('visible');
  }else{
    loginElement.style.display = '';
    userElem.style.display = 'none';
    buttonNewPost.classList.remove('visible');
    addPostElem.classList.remove('visible');
    postWrap.classList.add('visible');
    
  }
}

const showAllPosts = () => {

  
  
  let postHTML = '';

  setPosts.allPosts.forEach(({title, text, tags, author, date, like, comments}) => {
    postHTML += `
    <section class="post">
    <div class="post-body">
      <h2 class="post-title">${title}</h2>
      <p class="post-text">${text}</p>
      
      <div class="tags">
        ${tags.map(tag => `<a href="#" class="tag">#${tag}</a>`).join('')}
      </div>
    </div>
    <div class="post-footer">
      <div class="post-buttons">
        <button class="post-button likes">
          <svg width="19" height="20" class="icon icon-like">
            <use xlink:href="img/icons.svg#like"></use>
          </svg>
          <span class="likes-counter">${like}</span>
        </button>
        <button class="post-button comments">
          <svg width="21" height="21" class="icon icon-comment">
            <use xlink:href="img/icons.svg#comment"></use>
          </svg>
          <span class="comments-counter">${comments}</span>
        </button>
        <button class="post-button save">
          <svg width="19" height="19" class="icon icon-save">
            <use xlink:href="img/icons.svg#save"></use>
          </svg>
        </button>
        <button class="post-button share">
          <svg width="17" height="19" class="icon icon-share">
            <use xlink:href="img/icons.svg#share"></use>
          </svg>
        </button>
      </div>
      <div class="post-author">
        <div class="author-about">
          <a href="#" class="author-username">${author.displayName}</a>
          <span class="post-time">${date}</span>
        </div>
        <a href="#" class="author-link"><img src=${author.photo || "img/avatar.jpeg"} alt="avatar" class="author-avatar"></a>
      </div>
    </div>
  </section>
    `;
  });
  postWrap.innerHTML = postHTML;
  addPostElem.classList.remove('visible');
  postWrap.classList.add('visible');
}

const showAddPosts = () => {
  addPostElem.classList.add('visible');
  postWrap.classList.remove('visible');
}

const init = () => {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
  
    const emailValue = emailInput.value;
    const passInputValue = passInput.value;
  
    setUsers.logIn(emailValue, passInputValue, toggleAuthDOM);
    loginForm.reset();
  });
  
  loginSignup.addEventListener('click', e => {
    e.preventDefault();
    const emailValue = emailInput.value;
    const passInputValue = passInput.value;
  
    setUsers.signUp(emailValue, passInputValue, toggleAuthDOM);
    loginForm.reset();
  });
  
  exitBtn.addEventListener('click', e => {
    e.preventDefault();
    setUsers.logOut(toggleAuthDOM);
  })
  
  editElem.addEventListener('click', e => {
    e.preventDefault();
    editContainer.classList.toggle('visible');
    editUsername.value = setUsers.user.displayName;
  });
  
  editContainer.addEventListener('submit', e => {
    e.preventDefault();
    setUsers.editUser(editUsername.value, editPhotoURL.value, toggleAuthDOM);
    editContainer.classList.remove('visible');
  });
  // отслеживаем клик по кнопке меню и запускаем функцию 
  menuToggle.addEventListener('click', function (event) {
    // отменяем стандартное поведение ссылки
    event.preventDefault();
    // вешаем класс на меню, когда кликнули по кнопке меню 
    menu.classList.toggle('visible');
  });
  buttonNewPost.addEventListener('click', e => {
    e.preventDefault();
    showAddPosts()
  })
  addPostElem.addEventListener('submit', e => {
    e.preventDefault();
    const { postTags, postText, postTitle } = addPostElem.elements;
    if(postTitle.value.lenth < 3){
      alert('Слишком короткий заголовок');
      return;
    }
    if(postText.value.lenth < 50){
      alert('Слишком короткий пост');
      return;
    }
    setPosts.addPost(postTitle.value, postText.value, postTags.value, showAllPosts);
    addPostElem.classList.remove('visible');
    addPostElem.reset();
  })

  setUsers.initUser(toggleAuthDOM);
  setPosts.getPosts(showAllPosts);
}

document.addEventListener('DOMContentLoaded', init);



