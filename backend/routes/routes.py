from flask import Blueprint
from routes.auth_routes import login, signup, logout, check_session, login_google, google_callback
from routes.conference_routes import create_conference
from routes.ping_routes import ping
from routes.profile_routes import get_profile, update_profile, get_all_users
from routes.role_routes import assign_role
from routes.chad_routes import send_chad, get_received_chad, get_sent_chad
from routes.paper_routes import submit_paper
from routes.review_routes import submit_review
from routes.upload_routes import upload_file
from routes.notification_routes import get_notification, mark_notification_as_answered

# Define blueprints
auth_bp = Blueprint("auth", __name__)
conference_bp = Blueprint("conference", __name__)
ping_bp = Blueprint("ping", __name__)
profile_bp = Blueprint("profile", __name__)
role_bp = Blueprint("role", __name__)
chad_bp = Blueprint("chad", __name__)
paper_bp = Blueprint("paper", __name__)
review_bp = Blueprint("review", __name__)
upload_bp = Blueprint("upload", __name__)
notification_bp = Blueprint("notification", __name__)

# Route bindings (logic attached here)
auth_bp.route("/login", methods=["POST"])(login)
auth_bp.route("/signup", methods=["POST"])(signup)
auth_bp.route("/logout", methods=["POST"])(logout)
auth_bp.route("/session", methods=["GET"])(check_session)
auth_bp.route("/login/google")(login_google)
auth_bp.route("/login/google/callback")(google_callback)


conference_bp.route("/create", methods=["POST"])(create_conference)

ping_bp.route("/", methods=["GET"])(ping)

profile_bp.route("/<user_id>", methods=["GET"])(get_profile)
profile_bp.route("/update", methods=["POST"])(update_profile)
profile_bp.route("/users", methods=["GET"])(get_all_users)

role_bp.route("/", methods=["POST"])(assign_role)

chad_bp.route("/send", methods=["POST"])(send_chad)
chad_bp.route("/inbox", methods=["GET"])(get_received_chad)
chad_bp.route("/outbox", methods=["GET"])(get_sent_chad)

paper_bp.route("/submit", methods=["POST"])(submit_paper)
review_bp.route("/submit/<paper_id>", methods=["POST"])(submit_review)

upload_bp.route("/<conference_id>/<track_name>", methods=["POST"])(upload_file)

notification_bp.route("/", methods=["GET"])(get_notification)
notification_bp.route("/mark_answered/<notification_id>/<is_accepted>", methods=["POST"])(mark_notification_as_answered)

# Register list
all_routes = [
    (auth_bp, "/auth"),
    (conference_bp, "/conference"),
    (ping_bp, "/ping"),
    (profile_bp, "/profile"),
    (role_bp, "/role"),
    (chad_bp, "/chad"),
    (paper_bp, "/paper"),
    (review_bp, "/review"), 
    (upload_bp, "/upload"),
    (notification_bp, "/notification")
]
