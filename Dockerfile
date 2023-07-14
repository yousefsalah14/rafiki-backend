FROM node:20.4.0


# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the files to the working directory
COPY . .

# Expose port 3008
EXPOSE 3008

# Run the app
CMD ["npm", "start"]

