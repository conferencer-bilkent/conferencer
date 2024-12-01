# conferencer
Conferencer Main Repo

# How to backend?
## prereqs:
1. Install java openjdk version "21.0.2"
   1. To check version you need to "java -version"
2. Install Apache Maven 3.9.9
    1. To check version you need to "mvn -v"
3. Install postgresql 14
    1. get into postgres user (possibly with password "password")
        1. if the password is not password, after getting in forcefully set the password to "password" by running ALTER USER postgres PASSWORD 'password'
    2. run CREATE DATABASE conferencer_db
4. clone repo && cd repo
5. cd backend
6. mvn install
7. congrats you compiled backend
8. run app and check localhost 8080
9. now wait for it to be written or start writing from somewhere. no functionality is implemented yet. 
