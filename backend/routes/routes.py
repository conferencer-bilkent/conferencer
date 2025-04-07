from flask import Blueprint
from routes.auth_routes import login, signup, logout, check_session
from routes.conference_routes import create_conference
from routes.ping_routes import ping
from routes.profile_routes import get_profile, update_profile
from routes.role_routes import assign_role

# Define blueprints
auth_bp = Blueprint("auth", __name__)
conference_bp = Blueprint("conference", __name__)
ping_bp = Blueprint("ping", __name__)
profile_bp = Blueprint("profile", __name__)
role_bp = Blueprint("role", __name__)

# Route bindings (logic attached here)
auth_bp.route("/login", methods=["POST"])(login)
auth_bp.route("/signup", methods=["POST"])(signup)
auth_bp.route("/logout", methods=["POST"])(logout)
auth_bp.route("/session", methods=["GET"])(check_session)

conference_bp.route("/create", methods=["POST"])(create_conference)

ping_bp.route("/", methods=["GET"])(ping)

profile_bp.route("/<user_id>", methods=["GET"])(get_profile)
profile_bp.route("/update", methods=["POST"])(update_profile)

role_bp.route("/", methods=["POST"])(assign_role)

# Register list
all_routes = [
    (auth_bp, "/auth"),
    (conference_bp, "/conference"),
    (ping_bp, "/ping"),
    (profile_bp, "/profile"),
    (role_bp, "/role"),
]
