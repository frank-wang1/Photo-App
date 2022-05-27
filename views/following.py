from flask import Response, request
from flask_restful import Resource
from models import Following, User, db
import json
import flask_jwt_extended

def get_path():
    return request.host_url + 'api/posts/'

class FollowingListEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user
    
    @flask_jwt_extended.jwt_required()
    def get(self):
        # return all of the "following" records that the current user is following
        following = Following.query.filter_by(user_id = self.current_user.id).all()
        following_json = [followee.to_dict_following() for followee in following]
        return Response(json.dumps(following_json), mimetype="application/json", status=200)
        #return Response(json.dumps([]), mimetype="application/json", status=200)

    @flask_jwt_extended.jwt_required()
    def post(self):
        # create a new "following" record based on the data posted in the body 
        body = request.get_json()
 
    

        #not working
        # if body.get('user_id') in (Following.query.filter_by(user_id = self.current_user.id).all()):
        #     return Response(json.dumps({"message": "'user_url' is required"}), mimetype="application/json", status=400)
        
        #this is right
        if not body.get('user_id'):
            return Response(json.dumps({"message": "'user_url' is required"}), mimetype="application/json", status=400)
       
        following_id = body.get('user_id')

        #checking that user id is valid
        

        if (type(following_id) == str and not following_id.isdecimal()) or (type(following_id) != int and type(following_id) != str):
            return Response(json.dumps({"message": "following id must be int"}), mimetype="application/json", status=400)
      
        if not User.query.get(following_id):
            return Response(json.dumps({"message": "invalid user id"}), mimetype="application/json", status=404)

        #checking for duplicates
        # following = Following.query.filter_by(user_id = self.current_user.id).all()
        # if following_id in [f.following_id for f in following]:   
        #     return Response(json.dumps({"message" : "duplicate following"}), mimetype="application/json", status=400)
        num_of_following = Following.query.filter_by(user_id = self.current_user.id).filter_by(following_id=following_id).count()
        if num_of_following > 0:   
            return Response(json.dumps({"message" : "duplicate following"}), mimetype="application/json", status=400)
    
        # if not isinstance(following_id, int):
        #    return Response(json.dumps({"message" : "invalid user id format"}), mimetype="application/json", status=400)

        new_following = Following(
            user_id = self.current_user.id, 
            following_id = following_id
        )
        #if new_post.user_id != self.current_user.id:
        #    return Response(json.dumps({"message": "id={0} is invalid"}), mimetype="application/json", status=201)

        db.session.add(new_following)    # issues the insert statement
        db.session.commit()         # commits the change to the database 

        return Response(json.dumps(new_following.to_dict_following()), mimetype="application/json", status=201)

class FollowingDetailEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user
    
    @flask_jwt_extended.jwt_required()
    def delete(self, id):
        # delete "following" record where "id"=id
        # print(id)
        # return Response(json.dumps({}), mimetype="application/json", status=200)
        Following_rec = Following.query.get(id)
        if not Following_rec:
            return Response(json.dumps({"message": "id={0} is invalid"}), mimetype="application/json", status=404)

        if Following_rec.user_id != self.current_user.id:
            return Response(json.dumps({"message": "id={0} is invalid"}), mimetype="application/json", status=404)

        
        Following.query.filter_by(id=id).delete()
        db.session.commit()
        return Response(json.dumps("message:" "Following record id={0} was succesfully deleted.".format(id)), mimetype="application/json", status=200)



def initialize_routes(api):
    api.add_resource(
        FollowingListEndpoint, 
        '/api/following', 
        '/api/following/', 
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )
    api.add_resource(
        FollowingDetailEndpoint, 
        '/api/following/<int:id>', 
        '/api/following/<int:id>/', 
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )
