var posts = []
const numPosts=5

$(document).ready(async function () {
    await fetchPosts()
    console.log(posts)
    displayDataInTable(posts, numPosts)
})

sortOnPostIdV=1
sortOnUserIdV=1
sortOnTitleV=1
sortOnBodyV=1


function display(){
    $('table tbody').empty()
    displayDataInTable(posts,numPosts)
}

function sortOnPostId(){
    console.log("Sorting on Post ID")
    sortOnPostIdV= !sortOnPostIdV
    for(var i=0;i<posts.length;i++){
        for(var j=i+1;j<posts.length;j++){
            if(sortOnPostIdV==0){
                if(posts[i].id < posts[j].id){
                    temp=posts[i]
                    posts[i]=posts[j]
                    posts[j]=temp
                }    
            }else{
                if(posts[i].id > posts[j].id){
                    temp=posts[i]
                    posts[i]=posts[j]
                    posts[j]=temp
                }
    
            }
        }
    }
    display()
}

function sortOnUserId(){
    console.log("Sorting on User ID")
    sortOnUserIdV= !sortOnUserIdV
    for(var i=0;i<posts.length;i++){
        for(var j=i+1;j<posts.length;j++){
            if(sortOnUserIdV==0){
                if(posts[i].userId < posts[j].userId){
                    temp=posts[i]
                    posts[i]=posts[j]
                    posts[j]=temp
                }    
            }else{
                if(posts[i].userId> posts[j].userId){
                    temp=posts[i]
                    posts[i]=posts[j]
                    posts[j]=temp
                }
            }
        }
    }
    display()
}

function sortOnTitle(){
    console.log("Sorting on Title")
    sortOnTitleV= !sortOnTitleV
    for(var i=0;i<posts.length;i++){
        for(var j=i+1;j<posts.length;j++){
            if(sortOnTitleV==0){
                if(posts[i].title < posts[j].title){
                    temp=posts[i]
                    posts[i]=posts[j]
                    posts[j]=temp
                }    
            }else{
                if(posts[i].title> posts[j].title){
                    temp=posts[i]
                    posts[i]=posts[j]
                    posts[j]=temp
                }
            }
        }
    }
    display()
}

function sortOnBody(){
    console.log("Sorting on Body")
    sortOnBodyV= !sortOnBodyV
    for(var i=0;i<posts.length;i++){
        for(var j=i+1;j<posts.length;j++){
            if(sortOnBodyV==0){
                if(posts[i].body < posts[j].body){
                    temp=posts[i]
                    posts[i]=posts[j]
                    posts[j]=temp
                }    
            }else{
                if(posts[i].body> posts[j].body){
                    temp=posts[i]
                    posts[i]=posts[j]
                    posts[j]=temp
                }
            }
        }
    }
    display()
}

fetchPosts = async () => {
    await $.ajax({
        type:'GET',
        url:'https://jsonplaceholder.typicode.com/posts',
        success:function(fetchedPosts){
            posts=fetchedPosts
            console.log("SUCCESS",posts)
        },
        error:function(){
            console.log("ERROR")
        }
    })
}
async function editPost(id){

    console.log("Edit ",id)
    post=posts.find(e=> e.id==id)
    console.log(post)
    setFormData(post)
    $('#postId').text(id)
    slideDown("Update")
}

async function removePost(id){
    if(confirm("Do you confirm to delete this post?")){
        if(await deletePost(id)){
            console.log("DELETED post with ID",id)
            $('#'+id).remove()
            posts=posts.filter(e=> e.id!=id)
        }
    }
}

deletePost = async (id) => {
    con=false
    await $.ajax({
        type:'DELETE',
        url:'https://jsonplaceholder.typicode.com/posts/'+id,
        success:function(post){
            console.log("DELETE SUCCESS",post)
            con=true
        },
        error:function(){
            console.log("ERROR")
            con=false
        }
    })
    return con
}

submitForm =() => {
    con=false
    let postData=getFormData()
    if(!validate(postData))
        return false
    if($('#submit-btn').val() == "Update"){
        id=$("#postId").text()
        post=posts.find(e=> e.id==id)
        console.log("PATCH data sent: ",postData)
        $.ajax({
            type:'PATCH',
            url:'https://jsonplaceholder.typicode.com/posts/'+id,
            data:postData,
            success:function(updatedPost){
                console.log("SUCCESS",updatedPost)
                con=true
                post.userId=updatedPost.userId
                post.title=updatedPost.title
                post.body=updatedPost.body
                $("#userId"+id).html(post.userId)
                $("#titleId"+id).html(post.title)
                $("#bodyId"+id).html(post.body)
            },
            error:function(){
                console.log("ERROR in updating!!")
                con=false
            }
        })
        return false
    }
    console.log("Post data sent: ",postData)
    $.ajax({
        type:'POST',
        url:'https://jsonplaceholder.typicode.com/posts',
        data:postData,
        success:function(createdPost){
            console.log("SUCCESS",createdPost)
            con=true
            posts.push(createdPost)
            insertOnePostInTable(createdPost)
        },
        error:function(){
            console.log("ERROR")
            con=false
        }
    })
    return false
}

function insertOnePostInTable(post) {
    console.log("INSIDE FUNCTION ",post)
    var markup = "<tr id='"+post.id+"'><td>" + post.id + "</td><td>"+post.userId+"</td><td>" + post.title + "</td><td>" + post.body + "</td><td><button class='btn btn-light btn-sm' style='font-weight:bold; color:#3c9ca8;font-size:medium; margin:1%' onclick='editPost("+post.id+")'>Edit</button><button class='btn btn-light btn-sm' style='font-weight:bold; color:#3c9ca8;font-size:medium; margin:1%' onclick='removePost("+post.id+")'>Remove</button></td></tr>";
    $("table tbody").append(markup);
}

function getFormData(){
    userId = $('#userId').val()
    title = $('#title').val()
    body = $('#body').val()
    postData={userId,title,body}
    return postData
}

function setFormData(postData){
    userId = $('#userId').val(postData.userId)
    title = $('#title').val(postData.title)
    body = $('#body').val(postData.body)
}

function validate(post){
    let userIdField= document.getElementById("userId")
    let titleField= document.getElementById("title")
    let bodyField= document.getElementById("body")
    valid=true
    return valid
}

function displayDataInTable(posts, count = 3) {
    for (let i = 0; i < posts.length && i < count; i++) {
        post = posts[i]
        unq=post.id+""
        var markup = "<tr id='"+post.id+"'><td>" + post.id + "</td><td id='userId"+unq+"'>"+post.userId+"</td><td id='titleId"+unq+"'>" + post.title + "</td><td id='bodyId"+unq+"'>" + post.body + "</td><td><button class='btn btn-light btn-sm' style='font-weight:bold; color:#3c9ca8;font-size:medium; margin:1%' onclick='editPost("+post.id+")'>Edit</button><button class='btn btn-light btn-sm' style='font-weight:bold; color:#3c9ca8;font-size:medium; margin:1%' onclick='removePost("+post.id+")'>Remove</button></td></tr>";
        $("table tbody").append(markup);
    }
}