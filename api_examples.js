const axios = require('axios');
require('dotenv').config();
const fs = require('fs');

// Load the API Key from the .env file
const API_KEY = process.env.API_KEY;


const runDemo = async () => {

    // Get information for your current account
    const response = await fetch('https://cherty.io/api/get_account_info', {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      });
    const data = await response.json();
    console.log(data);

    // Upload a file and retrieve the CID
    try {
        const fileData = fs.readFileSync('earthrise.jpeg');
        const uploadResponse = await axios.post(
            `https://cherty.io/api/binary_data_upload`, fileData, {
            headers: {
            'Content-Type': 'application/octet-stream',
            'Authorization': `Bearer ${API_KEY}`,
            },
        })

        console.log('File uploaded successfully');
        console.log('CID:', uploadResponse.data.cid);
        earthrise_CID = uploadResponse.data.cid;
    } catch (error) {
        console.error('Error uploading file:', error.message);
    }

    // Download the file using the CID
    try {
        const downloadResponse = await axios.get(
            `https://cherty.io/api/file/${earthrise_CID}`, {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                },
                responseType: 'arraybuffer',
            })
        const buffer = Buffer.from(downloadResponse.data, 'binary');
        fs.writeFileSync('downloadedData.jpeg', buffer);
        console.log('File downloaded successfully');
    } catch (error) {
        console.error('Error downloading file:', error.message);
    }

    // Find permissions for this file
    const fileCID = 'bafkreiebdtqimpnqwt5magb2xdxg3b3q5wisyene4ujo5o6p73c5d2jqka';

    const accessRoutesResponse = await fetch(`https://cherty.io/api/access_routes/${fileCID}`, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      });
    const accessRoutes = await accessRoutesResponse.json();
    console.log(accessRoutes);

    // Get public info for a given id_cid
    id_cid = 'bafkreictbqkffrjs4jklzrm3ijszkmz5rcx3malvc3jkkvgyv7unhq2ddi'
    const publicAccountInfo_response = await fetch(`https://cherty.io/api/public_account_info/${id_cid}`, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      });
    const publicAccountInfo = await publicAccountInfo_response.json();
    console.log(publicAccountInfo);

    // Add permissions
    const permissions_object = {
        admins: [{"id": "113160473128016495295", "method": "google-oauth2"}],
        viewers: ['bafkreictbqkffrjs4jklzrm3ijszkmz5rcx3malvc3jkkvgyv7unhq2ddi']
    };

    const editPermissionsData = {
        cid: fileCID,
        owner: id_cid,
        permissions_object,
        mode: 'add'
      };
    
    const editPermissionsResponse = await axios.post(
        `https://cherty.io/api/edit_permissions`, editPermissionsData, {
            headers: {
                Authorization: `Bearer ${API_KEY}`,
            },
        });
    console.log(`Permissions response for CID ${fileCID}:`, editPermissionsResponse.data);

};
runDemo();