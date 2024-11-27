const express = require('express');
const mysql = require('mysql2/promise');
const TronWeb = require('tronweb');
const cors = require('cors');
const { S3Client, ListObjectsV2Command, PutObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME
};

const s3Config = {
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
  }
};

const s3Client = new S3Client(s3Config);

const pool = mysql.createPool(dbConfig);

const tronWeb = new TronWeb({
  fullHost: 'https://api.trongrid.io'
});

async function createTronAccount() {
  try {
    const account = await tronWeb.createAccount();
    const privateKey = account.privateKey;
    const address = tronWeb.address.fromPrivateKey(privateKey);
    return {
      address,
      privateKey
    };
  } catch (error) {
    console.error('Error creating the wallet:', error);
    return null;
  }
}

async function addWalletToDatabase(email, address, privateKey, s3FolderName) {
  if (email.length > 255 || address.length > 100 || privateKey.length > 64 || s3FolderName.length > 255) {
    throw new Error('Input data exceeds the schema constraints');
  }

  try {
    const [result] = await pool.execute(
      'INSERT INTO Wallets (Email, Address, PrivateKey, S3FolderName) VALUES (?, ?, ?, ?)',
      [email, address, privateKey, s3FolderName]
    );
    console.log('Data inserted:', result.insertId);
  } catch (error) {
    console.error('Error inserting wallet data:', error);
    throw error;
  }
}

async function userExists(email) {
  try {
    const [rows] = await pool.execute(
      'SELECT COUNT(*) AS count FROM Wallets WHERE Email = ?',
      [email]
    );
    const exists = rows[0].count > 0;
    return exists;
  } catch (error) {
    console.error('Error checking user existence:', error);
    throw error;
  }
}

async function createS3Folder(walletAddress) {
  const bucketName = process.env.BUCKET_NAME;
  const folderName = walletAddress + '/';

  const createFolder = async (folderPath) => {
    const params = {
      Bucket: bucketName,
      Key: folderPath,
      Body: '',
    };

    try {
      await s3Client.send(new PutObjectCommand(params));
      console.log(`Folder ${folderPath} created in bucket ${bucketName}`);
    } catch (error) {
      console.error(`Error creating folder ${folderPath}:`, error);
      throw error;
    }
  };

  try {
    await createFolder(folderName);
    await createFolder(folderName + 'media/');
    await createFolder(folderName + 'file/');
    return folderName;
  } catch (error) {
    console.error('Error creating S3 folders:', error);
    throw error;
  }
}

app.post('/api/create-wallet', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Missing email' });
  }

  try {
    const exists = await userExists(email);
    if (exists) {
      return res.status(200).json({ success: true, message: 'User already has a wallet' });
    }

    const account = await createTronAccount();
    if (account) {
      const s3FolderName = await createS3Folder(account.address);
      console.log(`S3 Folder Name: ${s3FolderName}`);
      await addWalletToDatabase(email, account.address, account.privateKey, s3FolderName);
      return res.status(200).json({ success: true, walletAddress: account.address });
    } else {
      console.error('Error generating Tron account');
      return res.status(500).json({ success: false, error: 'Error generating wallet' });
    }
  } catch (error) {
    console.error('Error creating wallet:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.post('/api/get-wallet-address', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Missing email' });
  }

  try {
    const [rows] = await pool.execute(
      'SELECT Address FROM Wallets WHERE Email = ?',
      [email]
    );

    if (rows.length > 0) {
      return res.status(200).json({ success: true, address: rows[0].Address });
    } else {
      return res.status(404).json({ success: false, error: 'Wallet not found' });
    }
  } catch (error) {
    console.error('Error fetching wallet address:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.post('/api/list-folder-contents', async (req, res) => {
  const { walletAddress, folderPath = '' } = req.body;
  const bucketName = process.env.BUCKET_NAME;
  const prefix = `${walletAddress}/file/${folderPath}`;

  if (!walletAddress) {
    return res.status(400).json({ error: 'Missing walletAddress' });
  }

  console.log(`Fetching contents for prefix: ${prefix}`);

  const params = {
    Bucket: bucketName,
    Prefix: prefix,
    Delimiter: '/'
  };

  try {
    const data = await s3Client.send(new ListObjectsV2Command(params));
    console.log('S3 response data:', JSON.stringify(data, null, 2));

    // Extract folders
    const folders = (data.CommonPrefixes || []).map(item => ({
      key: item.Prefix.replace(prefix, '').replace('/', ''),
      type: 'folder'
    }));

    // Extract files, ensuring they don't include the prefix and are not empty
    const files = (data.Contents || []).filter(item => {
      const fileKey = item.Key.replace(prefix, '');
      // Ensure the file is not a directory
      return fileKey && !fileKey.endsWith('/');
    }).map(item => {
      const fileKey = item.Key.replace(prefix, '');
      return {
        key: fileKey,
        size: item.Size,
        lastModified: item.LastModified,
        type: 'file'
      };
    });

    console.log('Folders:', folders);
    console.log('Files:', files);

    return res.status(200).json({ success: true, contents: [...folders, ...files] });
  } catch (error) {
    console.error('Error listing folder contents:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.get('/api/ping', (req, res) => {
  return res.status(200).json({ success: true, message: 'The server is connected' });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
