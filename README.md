

## [CalTrack](https://caltrack.tech)

### Table of Contents
- [Description](#description)
- [Website Screenshots](#screenshots)
- [Technologies Used](#technologies)
- [Running in development environment](#development)
- [Production deployment with Kubernetes](#production_kubernetes)

<a name="description"/>  

[CalTrack](https://caltrack.tech) is a calorie tracking app which helps users to keep track of their daily food consumption. This application allows users to create food entries against any date and they can view, edit or delete the entries at any point in time. Caltrack's dashboard also provides insights about user's consumption. There is an admin dashboard for administrators with metrics about the users' activity and control panel to view, edit or delete food entries of all the users.

<a name="screenshots"/>  

| [![snN4Cg.md.png](https://iili.io/snN4Cg.md.png)](https://freeimage.host/i/snN4Cg) |[![snN6Ga.md.png](https://iili.io/snN6Ga.md.png)](https://freeimage.host/i/snN6Ga) |    
|--|--|    
| [![snNgZF.md.png](https://iili.io/snNgZF.md.png)](https://freeimage.host/i/snNgZF) | [![snNP6J.md.png](https://iili.io/snNP6J.md.png)](https://freeimage.host/i/snNP6J) |
| [![snNLaR.md.png](https://iili.io/snNLaR.md.png)](https://freeimage.host/i/snNLaR)| [![snNSTP.md.png](https://iili.io/snNSTP.md.png)](https://freeimage.host/i/snNSTP) |
| [![snNUj1.md.png](https://iili.io/snNUj1.md.png)](https://freeimage.host/i/snNUj1) | [![snNs3v.md.png](https://iili.io/snNs3v.md.png)](https://freeimage.host/i/snNs3v) |

<a name="technologies"/>  

**Technologies Used:**

- Node.js
- React.js
- MongoDB
- Nginx
- Docker
- Kubernetes

<a name="development"/>  

**To run the app in development mode :**

- Create a new file in the project root directory `.env.backend.dev` with the following content :

      NODE_ENV=development  
      MONGODB_URL="mongodb://root:example@mongo-dev-server:27017/"  
      JWT_ACCESS_TOKEN_SECRET_KEY=u6wqlmTFoY0agZxQBShd3voqw905ARL5 
      JWT_REFRESH_TOKEN_SECRET_KEY=bn4aYXEB7Gvc2baTPnAZNlvKNsILYCP8  
      ADMIN_USERNAME=caltrack-admin  
      ADMIN_PASSWORD=AdminPass@10  
      ADMIN_EMAIL=caltrack-admin@gmail.com  
      NODEMAILER_EMAIL=YOUR_EMAIL  
      NODEMAILER_PASSWORD=YOUR_EMAIL_APP_PASSWORD 

- Run the following command in the root directory to start up the development server :

      docker-compose -f docker-compose.dev.yml up --build

<a name="production_kubernetes"/>  

**For Production build and deployment with Kubernetes:**

- Create a file `backend-env-secrets.yml` in the ./k8s directory with the following content :

      apiVersion: v1
      kind: Secret
      metadata:
        name: caltrack-backend-env-secrets
      type: Opaque
      stringData:
        MONGODB_URL: "MONGODB_URL"
        JWT_ACCESS_TOKEN_SECRET_KEY: "RANDOM_STRING"
        JWT_REFRESH_TOKEN_SECRET_KEY: "RANDOM_STRING"
        ADMIN_USERNAME: "ADMIN_USERNAME"
        ADMIN_PASSWORD: "ADMIN_PASSOWRD"
        ADMIN_EMAIL: "ADMIN_EMAIL"
        NODEMAILER_EMAIL: "YOUR_EMAIL"
        NODEMAILER_PASSWORD: "YOUR_EMAIL_APP_PASSWORD"

- Update the image name of services in `docker-compose.yml` and build the images and push it to your docker repository using the following commands

      docker-compose build --pull    
      docker-compose push   
- Set your gcloud project id using the following command :

      gcloud config set project $PROJECT_ID   

- Generate kubectl config using the following command :

      gcloud container clusters get-credentials $CLUSTER_NAME --zone $ZONE --project $PROJECT_ID   
- Create cluster role binding to use ingress-nginx using the following command:

      kubectl create clusterrolebinding cluster-admin-binding \
      --clusterrole cluster-admin \
      --user $(gcloud config get-value account)

- Install ingress-nginx :

      kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.3.0/deploy/static/provider/cloud/deploy.yaml  

- Install cert-manager for SSL support :

      kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.9.1/cert-manager.yaml

- To deploy to gcloud, run the following command from root directory :

      kubectl apply -f ./k8s   

- You should see your resources created and the application running. To access the application, simply get the ingress controller IP Address and use it in browser.  
  