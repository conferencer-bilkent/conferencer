# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# install dependencies to virtual environment
pip install Flask flask-cors flask-pymongo flask-session flask-bcrypt flask-jwt-extended python-dotenv

# install MongoDB then start
# macOS (Homebrew)
brew services start mongodb-community
# Windows (CMD)
net start MongoDB

# backend ready 
 
 
 
 
 
