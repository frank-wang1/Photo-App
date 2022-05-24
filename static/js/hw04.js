const story2Html = story => {
    return `
        <div>
            <img src="${ story.user.thumb_url }" class="pic" alt="profile pic for ${ story.user.username }" />
            <p>${ story.user.username }</p>
        </div>
    `;
};

const handleLike = ev =>{
    console.log("handle like functionality");
    const elem = ev.currentTarget;
    if (elem.getAttribute('aria-checked') === 'true'){
        console.log('unlike post');
        deleteLike(elem);
    }else {
        console.log('like post');
        createLike(elem)
    }
};

const createLike = elem => {
    const postId = Number(elem.dataset.postId)
    const postBody = {"post_id": postId}
    fetch ('/api/posts/likes/',{
        method:"POST",
        headers: {
            'Content-type':'application/json',
        },
        body: JSON.stringify(postBody)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        console.log('redraw the post');
        redrawPost(postId);
    });
    // const liking = await response.json()
    // elem.innerHTML = "unlike";
    // elem.classList.add('unlike');
    // elem.classList.remove('like');
    // elem.setAttribute('aria-checked', 'true');
    // elem.setAttribute('aria-label', 'follow');
    // // elem.setAttribute('data-like-id', following.id);
    // console.log("liked");
};

const deleteLike = elem => {
    const postId = Number(elem.dataset.postId)
    console.log('unlike post', elem)
    fetch (`/api/posts/likes/${elem.dataset.likeId}`,{
        method:"DELETE",
        headers: {
            'Content-type':'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        redrawPost(postId);
    });
    // const following_deleted = await response.json()
    // elem.innerHTML = "follow";
    // elem.classList.add('follow');
    // elem.classList.remove('unfollow');
    // elem.setAttribute('aria-checked', 'false');
    // elem.removeAttribute('data-following-id');
    // console.log(following_deleted);
};

const redrawPost = (postId, callback) => {
    fetch(`/api/posts/${postId}`)
        .then(response => response.json())
        .then(updatedPost => {
            if(!callback){
                redrawCard(updatedPost);
            }else{
                callback(updatedPost);
                document.getElementById(`#newcomm_${postId}`).focus();
            }
    });
};

const redrawCard = post =>{
    console.log(post);
    const html = post2Html(post);
    const newElement = stringToHTML(html);
    const postElement = document.querySelector(`#post_${post.id}`);
    postElement.innerHTML = newElement.innerHTML;
}

const handleBookmark = ev =>{
    console.log("handle bookmark functionality");
    const elem = ev.currentTarget;
    if (elem.getAttribute('aria-checked') === 'true'){
        console.log('unbookmark post');
        unbookmarkPost(elem);
    }else {
        console.log('bookmark post');
        bookmarkPost(elem)
    }
};

const bookmarkPost = elem => {
    const postId = Number(elem.dataset.postId)
    const postBody = {"post_id": postId}
    fetch ('/api/bookmarks/',{
        method:"POST",
        headers: {
            'Content-type':'application/json',
        },
        body: JSON.stringify(postBody)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        console.log('redraw the post');
        redrawPost(postId);
    });
    // const liking = await response.json()
    // elem.innerHTML = "unlike";
    // elem.classList.add('unlike');
    // elem.classList.remove('like');
    // elem.setAttribute('aria-checked', 'true');
    // elem.setAttribute('aria-label', 'follow');
    // // elem.setAttribute('data-like-id', following.id);
    // console.log("liked");
};

const unbookmarkPost = elem => {
    const postId = Number(elem.dataset.postId)
    console.log('unbookmark post', elem)
    fetch (`/api/bookmarks/${elem.dataset.bookmarkId}`,{
        method:"DELETE",
        headers: {
            'Content-type':'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        redrawPost(postId);
    });
    // const following_deleted = await response.json()
    // elem.innerHTML = "follow";
    // elem.classList.add('follow');
    // elem.classList.remove('unfollow');
    // elem.setAttribute('aria-checked', 'false');
    // elem.removeAttribute('data-following-id');
    // console.log(following_deleted);
};

// <section>
    //     <img src="${post.image_url}"/>
    //     <button onclick = "handeLike(event);"> Like</button>
    // </section>


const renderLikeButton = post => {
    if (post.current_user_like_id){
        return `
        <button 
            data-post-id = "${post.id}"
            data-like-id = "${post.current_user_like_id}"
            aria-checked="true"
            aria-label="Like/Unlike"
            onclick="handleLike(event);" >
            <i class="fas fa-heart" ></i>
        </button>
        `;
    }else{
        return `
        <button 
            data-post-id = "${post.id}"
            aria-checked="false"
            aria-label="Like/Unlike"
            onclick="handleLike(event);" >
            <i class="far fa-heart" ></i>
        </button>
        `;
    }
};



const renderBookmarkButton = post => {
    if (post.current_user_bookmark_id){
        return `
        <button 
            data-post-id = "${post.id}"
            data-bookmark-id = "${post.current_user_bookmark_id}"
            aria-checked="true"
            aria-label="Bookmarked/NotBookmarked"
            onclick="handleBookmark(event);" >
            <i class="fas fa-bookmark" ></i>
        </button>
        `;
    }else{
        return `
        <button 
            data-post-id = "${post.id}"
            aria-checked="false"
            aria-label="Bookmarked/NotBookmarked"
            onclick="handleBookmark(event);" >
            <i class="far fa-bookmark" ></i>
        </button>
        `;
    }
};

const stringToHTML = htmlString => {
    var parser = new  DOMParser();
    var doc = parser.parseFromString(htmlString, 'text/html');
    return doc.body.firstChild;
}

//display comments need to be finished
const displayComments = post => {
    const comment = post.comments[post.comments.length - 1]
    if (post.comments.length > 1){
        //display button
        return `
        <div class="viewbutton">
        <button  
        class="viewcomments"
        data-post-id=${post.id} 
        onclick="showModal(event)"> 
            View all ${post.comments.length} Comments
        </button>
        </div>
        <div class="firstcomment">
            <p> <strong>${comment.user.username}</strong> ${comment.text}</p>
        </div>`;
    }else if(post.comments.length === 1){
        //display single comment
        const firstcomment = post.comments[0]
        return `<p><strong>${firstcomment.user.username}</strong> ${firstcomment.text}</p>`
    }else{
        return '';
    }
};



const showModal = ev =>{
    const postId = Number(ev.currentTarget.dataset.postId);
    redrawPost(postId, post => {
        const html = post2Modal(post);
        document.querySelector(`#post_${post.id}`).insertAdjacentHTML('beforeend', html);
    });
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
    document.body.classList.add('modal');
};

const post2Html = post => {
    return `
    <div id="post_${post.id}" class="card">
        <div class="carduserbox">
            <div class="myusername">
                <p>
                    ${post.user.username}
                </p>
            </div>
            <div class="shareicon">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
        <img src="${post.image_url}" alt="card_pfp"/>
        <div class="iconsandmessages">
            <div class="iconsection">
                <div class="iconsleft">
                     <div class="heart">
                        ${renderLikeButton(post)}
                     </div>
                     <div class="textbubble">
                        <i class="far fa-comment"></i>
                    </div>
                    <div class="airplane">
                        <i class="far fa-paper-plane"></i>
                    </div>
                </div>
                <div class="save">
                    ${renderBookmarkButton(post)}
                </div>
            </div>
            <div class="likesection">
                <p>
                    <span style="font-weight:bold">${post.likes.length} likes</span>
                </p>
            </div>
            <div class="captionsection">
                <div class="caption">
                    <div class="userhandle">
                        <p>
                            <span style="font-weight:bold">${post.user.username}</span>
                            ${post.caption}<a href="url" class="more">
                                more
                            </a>
                        </p>
                    </div>
                </div>
                
            </div>

            <div class="commentsection">
            ${displayComments(post)}
            </div>
            
            <div class="daysago">
                    <p>
                        ${post.display_time}
                    </p>
            </div>
            </div>
            <div class="makecommentsec">
                <div class="iconandcomment">
                    <div class="smileicon">
                        <i class="far fa-smile"></i>
                    </div>
                    <div class="addcomment">
                        <input type="text" id="newcomm_${post.id}" placeholder="Add a comment..." title = "text_input_box" value="">
                    </div>
                </div>
                <div class="post">
                    <button data-post-id=${post.id} onclick="addComment(event)">
                        Post
                    </button>
                </div>

            </div>
    </div>   
    `;
};

const addComment = ev => {
    var elem = ev.currentTarget;
    console.log(elem.dataset);
    var postId = elem.dataset.postId;
    console.log(postId);
    var text = document.querySelector(`#newcomm_${postId}`).value;
    const postData = {
        "post_id": postId,
        "text": text
    };
    fetch("/api/comments", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            redrawPost(postId);
        });
};


// const addComment = ev =>{
//     // const comment = post.comments[post.comments.length - 1]
//     // if (post.comments.length > 1){
//     //     //display button
//     //     return `
//     //     <div class="viewbutton">
//     //     <button  
//     //     class="viewcomments"
//     //     data-post-id=${post.id} 
//     //     onclick="showModal(event)"> 
//     //         View all ${post.comments.length} Comments
//     //     </button>
//     //     </div>
//     //     <div class="firstcomment">
//     //         <p> <strong>${comment.user.username}</strong> ${comment.text}</p>
//     //     </div>`;
//     console.log('added comment');
// };

const post2Modal = post => {
    return `
    <div class="modal-bg" aria-hidden="false" role="dialog">
            <div class="modal-body">
                <button class="close" aria-label="Close the modal window" aria-hidden="true" onclick="closeModal(event);">Close</button>
                <div class="modimage">
                <img src="${post.image_url}"/>
                </div>
                <div class="container">
                        <h3>
                        <img class="profile-pic" alt="Profile pic of comment poster" src="${post.user.thumb_url}"/>
                        ${post.user.username}
                        </h3>
                        <div class="modal-comments"> ${createCommentsModal(post.comments)} </div>
                </div>
            </div>
    </div>
        `;
};



const createCommentsModal = comments => {
    let html = ``;
    for (let comment of comments) {
        html += `
            <div class = "commwithoutheart">
                <div>
                    <div class="modal-comment">
                        <img src="${ comment.user.thumb_url }" alt="Profile pic of ${ comment.user.username }" />
                        <p class="modal-comment-content">
                            <strong> ${ comment.user.username } </strong> ${ comment.text }
                        </p>
                    </div>
                    <p class="time"> 
                    <strong> ${ comment.display_time } </strong>
                    </p>
                </div>
                <i class="far fa-heart" ></i>
            </div>
        `;
    }
    return html;
};

                        /*<div class="row">
                         <p>Some comment text</p>
                         <button class="like-comment">some button</button>
                        </div>
                        <div class="row">
                         <p>Some comment text</p>
                         <button class="like-comment">some button</button>
                        </div>
                        <div class="row">
                         <p>Some comment text</p>
                         <button class="like-comment">some button</button>
                        </div>
                        <div class="row">
                         <p>Some comment text</p>
                         <button class="like-comment">some button</button>
                        </div>
                        <div class="row">
                         <p>Some comment text</p>
                         <button class="like-comment">some button</button>
                        </div>
                        <div class="row">
                         <p>Some comment text</p>
                         <button class="like-comment">some button</button>
                        </div>
                        <div class="row">
                         <p>Some comment text</p>
                         <button class="like-comment">some button</button>
                        </div>*/

// <div class="modal-body">
                //     <img src="${post.image_url}"/>
                //     <div class="row">
                //         <p>Some comment text</p>
                //         <button class="like-comment">some button</button>
                //     </div>
                //     <div class="row">
                //         <p>Some comment text</p>
                //         <button class="like-comment">some button</button>
                //     </div>
                //     <div class="row">
                //         <p>Some comment text</p>
                //         <button class="like-comment">some button</button>
                //     </div>
                //     <div class="row">
                //         <p>Some comment text</p>
                //         <button class="like-comment">some button</button>
                //     </div>
                //     <div class="row">
                //         <p>Some comment text</p>
                //         <button class="like-comment">some button</button>
                //     </div>
                // </div>

const closeModal = ev =>{
    console.log('close modal');
    document.querySelector('.modal-bg').remove();
    var $body = $(window.document.body);
    $body.css("overflow", "auto");
    $body.width("auto");
};

// fetch data from your API endpoint:
const displayStories = () => {
    fetch('/api/stories')
        .then(response => response.json())
        .then(stories => {
            const html = stories.map(story2Html).join('\n');
            document.querySelector('.stories').innerHTML = html;
        })
};

const displayPosts = () => {
    fetch('/api/posts')
        .then(response => response.json())
        .then(posts => {
            const html = posts.map(post2Html).join('\n');
            document.querySelector('#posts').innerHTML = html;
        })
};

const profile2Html = async (profile) =>{
    const html = `
    <img src="${profile.thumb_url}" class = "pic"/>
    <h2>${profile.username}</h2>`
    return html
    
};

const user2Html = user =>{
    return `
    <section class = "suggestion">
        <img src = ${user.thumb_url}" class="pic" alt="profile pic for ${user.username}"/>
        <div>
            <p class="username">${user.username}</p>
            <p class="suggestion-text">suggested for you</p>
        </div>
        <div>
            <button
                class="link follow"
                aria-label="Follow"
                aria-checked="false"
                data-user-id = "${user.id}"
                onclick="toggleFollow(event)">follow</button>
        </div>
    </section>
    `;
};
//https://photoapp-spring.herokuapp.com/api/stories


const displayPanel = async () => {
    const profile_res = await fetch('/api/profile')
    const profile = await profile_res.json()
    const prof_html = await profile2Html(profile)
    document.querySelector('aside header').innerHTML = prof_html

    const suggs_res = await fetch('/api/suggestions/')
    const suggs = await suggs_res.json()
    const html = await suggs.map(user2Html).join('\n')
    document.querySelector('.suggestions div').innerHTML = html
};

const createFollowing = async (elem) => {
    const postbody = {"user_id":elem.dataset.userId}
    const response = await fetch ('/api/following',{
        method:"POST",
        headers: {
            'Content-type':'application/json',
        },
        body: JSON.stringify(postbody)
    })
    const following = await response.json()
    elem.innerHTML = "unfollow";
    elem.classList.add('unfollow');
    elem.classList.remove('follow');
    elem.setAttribute('aria-checked', 'true');
    elem.setAttribute('aria-label', 'follow');
    elem.setAttribute('data-following-id', following.id);
    console.log("following");
};

const deleteFollowing = async (elem) => {
    const response = await fetch (`/api/following/${elem.dataset.followingId}`,{
        method:"DELETE",
        headers: {
            'Content-type':'application/json',
        },
    })
    const following_deleted = await response.json()
    elem.innerHTML = "follow";
    elem.classList.add('follow'); 
    elem.classList.remove('unfollow');
    elem.setAttribute('aria-checked', 'false');
    elem.removeAttribute('data-following-id');
    console.log(following_deleted);
};

const toggleFollow = async(ev) =>{
    const elem = ev.currentTarget
    if (elem.getAttribute ('aria-checked') === 'false'){
        console.log("create follwoing")
        await createFollowing(elem)
    } else{
        console.log('delete following')
        await deleteFollowing(elem)
    }
};



const initPage = () => {
    displayPosts();
    displayStories();
    displayPanel();
    
};


// invoke init page to display stories:
initPage();


