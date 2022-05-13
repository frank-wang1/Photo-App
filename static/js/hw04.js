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

const post2Html = post => {
    return `
    <section>
        <img src="${post.image_url}"/>
        <button onclick = "handeLike(event);"> Like</button>
    </section>
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