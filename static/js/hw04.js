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
};

const handleBookmark = ev =>{
    console.log("handle bookmark functionality");
};

// <section>
    //     <img src="${post.image_url}"/>
    //     <button onclick = "handeLike(event);"> Like</button>
    // </section>
const post2Html = post => {
    return `
    
    <div class="card">

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
                        <a onclick="handleLike(event)" ><i class="far fa-heart" aria-checked="false" ></i></a>
                     </div>
                     <div class="textbubble">
                        <i class="far fa-comment"></i>
                    </div>
                    <div class="airplane">
                        <i class="far fa-paper-plane"></i>
                    </div>
                </div>
                <div class="save">
                    <i class="far fa-bookmark"></i>
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



            <!-- {% if card.get('comments')|length > 1 %}
            <p>View all 3 comments</p>
            {% endif %} -->

            <!-- {% if card.get('comments')|length > 1 %}
            <p>View all {{card.get('comments')|length}} comments</p>
            {% endif %} -->

            <div class="commentsection">
                {% if card.get('comments')|length > 1 %}
                <a href='#' class="blue">View all {{card.get('comments')|length}} comments</a>
                <div class="comment">
                    <div class="userhandle">
                        <p> 
                            <span style="font-weight:bold">{{card.comments[0].user.username}}</span>
                            {{card.comments[0].get('text')}}
                        </p>
                    </div>
                </div>
                {% elif card.get('comments')|length == 1 %}
                <div class="comment">
                    <div class="userhandle">
                        <p>
                            <p> 
                                <span style="font-weight:bold">{{card.comments[0].user.username}}</span>
                                {{card.comments[0].get('text')}}
                            </p>
                        </p>
                    </div>  
                </div>
                {% endif %}
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
                        <input type="text" placeholder="Add a comment..." title = "text_input_box" id="text">

                    </div>
                </div>
                <div class="post">
                    <a href="url" class="more" target="blank">
                        Post
                    </a>
                </div>

            </div>
    </div>   
    `;
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
                class=" link follow"
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
        console.log("create following")
        await createFollowing(elem)
    } else{
        console.log('delete following')
        await deleteFollowing(elem)
    }
};


const createLike = async (elem) => {
    const postbody = {"user_id":elem.dataset.curre}
    const response = await fetch ('/api/post',{
        method:"POST",
        headers: {
            'Content-type':'application/json',
        },
        body: JSON.stringify(postbody)
    })
    const liking = await response.json()
    elem.innerHTML = "unlike";
    elem.classList.add('unlike');
    elem.classList.remove('like');
    elem.setAttribute('aria-checked', 'true');
    elem.setAttribute('aria-label', 'follow');
    // elem.setAttribute('data-like-id', following.id);
    console.log("liked");
};

// const deleteLike = async (elem) => {
//     const response = await fetch (`/api/following/${elem.dataset.followingId}`,{
//         method:"DELETE",
//         headers: {
//             'Content-type':'application/json',
//         },
//     })
//     const following_deleted = await response.json()
//     elem.innerHTML = "follow";
//     elem.classList.add('follow');
//     elem.classList.remove('unfollow');
//     elem.setAttribute('aria-checked', 'false');
//     elem.removeAttribute('data-following-id');
//     console.log(following_deleted);
// };


const toggleLike = async(ev) =>{
    const elem = ev.currentTarget
    if (elem.getAttribute ('aria-checked') === 'false'){
        console.log("create like")
        await createLike(elem)
    } else{
        console.log('delete like')
        await deleteLike(elem)
    }
};



const initPage = () => {
    displayPosts();
    displayStories();
    displayPanel();
    
};

// invoke init page to display stories:
initPage();


// const toggleFollow = ev =>{
//     const elem = ev.currentTarget
//     if (elem.innerHTML === 'follow'){
//         console.log("create following")
//         createFollowing(elem.dataset.userId, elem);
//     } else{
//         console.log('delete following')
//         deleteFollowing(elem.dataset.followingId, elem);
//     }
// };


// const createFollowing = (userId, elem) => {
//     const postBody = {"user_id":userId}
//     fetch ('/api/following/',{
//         method:"POST",
//         headers: {
//             'Content type': 'application/json',
//         },
//         body: JSON.stringify(postBody)
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log(data);
//         elem.innerHTML = 'unfollow';
//         elem.classList.add('unfollow');
//         elem.classList.remove('follow');
//         elem.setAttribute('aria-checked', 'true');
//         elem.setAttribute('data-following-id', data.id);
//     });
//     // const following = await response.json()
//     // elem.innerHTML = "unfollow";
//     // elem.classList.add('unfollow');
//     // elem.classList.remove('follow');
//     // elem.setAttribute('aria-checked', 'true');
//     // elem.setAttribute('data-following-id', following.id);
//     // console.log("following");
// };

// const deleteFollowing = (followingId, elem) => {
//     fetch (`/api/following/${followingId}`,{
//         method:"DELETE"
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log(data);
//         elem.innerHTML = "follow";
//         elem.classList.add('follow');
//         elem.classList.remove('unfollow');
//         elem.setAttribute('aria-checked', 'false');
//         elem.removeAttribute('data-following-id');
//     });
//     // const following_deleted = await response.json()
//     // elem.innerHTML = "follow";
//     // elem.classList.add('follow');
//     // elem.classList.remove('unfollow');
//     // elem.setAttribute('aria-checked', 'false');
//     // elem.removeAttribute('data-following-id');
//     // console.log(following_deleted);
// };