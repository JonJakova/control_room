docker run -d --name cr_mongo -p 8101:27017 \
    -e MONGO_INITDB_ROOT_USERNAME=admin \
    -e MONGO_INITDB_ROOT_PASSWORD=admin \
    -e MONGO_INITDB_DATABASE=control_room \
    -v cr_mongo_data:/data/db \ 
    mongo