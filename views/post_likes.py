from flask import Response, request
from flask_restful import Resource
from models import LikePost, db, like_post
import json
from views import get_authorized_user_ids

class PostLikesListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    def post(self):
        # create a new "like_post" based on the data posted in the body 
        # body = request.get_json()
        # print(body)
        # return Response(json.dumps({}), mimetype="application/json", status=201)
        body = request.get_json()

        if not body.get('post_id'):
            return Response(json.dumps({"message": "'post_id' is required"}), mimetype="application/json", status=400)

        if not LikePost.query.get(body.get('post_id')):
            return Response(json.dumps({"message": "invalid post id"}), mimetype="application/json", status=404)

        user_ids = get_authorized_user_ids(self.current_user)
        if LikePost.query.get(body.get('post_id')).user_id not in user_ids:
            return Response(json.dumps({"message": "id is invalid"}), mimetype="application/json", status=400)

        likes = LikePost.query.filter_by(user_id = self.current_user.id).all()
        if body.get("post_id") in [f.post_id for f in likes]:   
            return Response(json.dumps({"message" : "duplicate like"}), mimetype="application/json", status=400)

        try:
            LikePost.query.get(body.get('post_id'))
        except:
            return Response(json.dumps({"message": "bad format"}), mimetype="application/json", status=400)

        new_post = LikePost(
            post_id=body.get('post_id'),
            user_id=self.current_user.id, # must be a valid user_id or will throw an error
        )
        db.session.add(new_post)    # issues the insert statement
        db.session.commit()         # commits the change to the database 

        return Response(json.dumps(new_post.to_dict()), mimetype="application/json", status=201)

class PostLikesDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    def delete(self, id):
        # delete "like_post" where "id"=id
        # print(id)
        # return Response(json.dumps({}), mimetype="application/json", status=200)
        likepost = LikePost.query.get(id)
        if not likepost:
            return Response(json.dumps({"message": "id={0} is invalid"}), mimetype="application/json", status=404)

        if likepost.user_id != self.current_user.id:
            return Response(json.dumps({"message": "id={0} is invalid"}), mimetype="application/json", status=404)

        LikePost.query.filter_by(id=id).delete()
        db.session.commit()
        return Response(json.dumps("message:" "like post was succesfully deleted.".format(id)), mimetype="application/json", status=200)



def initialize_routes(api):
    api.add_resource(
        PostLikesListEndpoint, 
        '/api/posts/likes', 
        '/api/posts/likes/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )

    api.add_resource(
        PostLikesDetailEndpoint, 
        '/api/posts/likes/<int:id>', 
        '/api/posts/likes/<int:id>/',
        resource_class_kwargs={'current_user': api.app.current_user}
    )
