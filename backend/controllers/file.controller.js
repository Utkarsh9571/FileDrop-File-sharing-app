import FileUpload from '../models/fileUpload.model.js';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';
import dotenv from 'dotenv';
import {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_BUCKET_NAME,
} from '../config/env.js';

dotenv.config();

const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

export const uploadFile = async (req, res, next) => {
  try {
    const file = req.file;
    const userId = req.user.id;

    if (!file) return res.status(400).json({ message: 'No file provided' });

    const uniqueKey = `${userId}/${Date.now()}-${crypto
      .randomBytes(8)
      .toString('hex')}-${file.originalname}`;

    const uploadParams = {
      Bucket: AWS_BUCKET_NAME,
      Key: uniqueKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await s3.send(new PutObjectCommand(uploadParams));

    const newFile = await FileUpload.create({
      fileName: uniqueKey,
      originalName: file.originalname,
      fileType: file.mimetype,
      size: file.size,
      s3Key: uniqueKey,
      bucket: AWS_BUCKET_NAME,
      owner: userId,
    });

    res.status(201).json({ message: 'File uploaded', file: newFile });
  } catch (error) {
    next(error);
  }
};

export const shareFile = async (req, res, next) => {
  try {
    const file = await FileUpload.findById(req.params.id);
    if (!file || file.owner.toString() !== req.user.id) {
      return res.status(404).json({ error: 'File not found or unauthorized' });
    }

    const command = new GetObjectCommand({
      Bucket: file.bucket || AWS_BUCKET_NAME,
      Key: file.s3Key,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 5 });

    res.json({ url: signedUrl });
  } catch (error) {
    next(error);
  }
};

export const deleteFile = async (req, res, next) => {
  try {
    const file = await FileUpload.findById(req.params.id);
    if (!file || file.owner.toString() !== req.user.id) {
      return res.status(404).json({ error: 'File not found or unauthorized' });
    }

    await s3.send(
      new DeleteObjectCommand({
        Bucket: file.bucket || AWS_BUCKET_NAME,
        Key: file.s3Key,
      })
    );

    await FileUpload.deleteOne({ _id: file._id });

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const downloadFile = async (req, res, next) => {
  try {
    const file = await FileUpload.findById(req.params.id);
    if (!file || file.owner.toString() !== req.user.id) {
      return res
        .status(404)
        .json({ message: 'File not found or unauthorized' });
    }

    const cmd = new GetObjectCommand({
      Bucket: file.bucket || AWS_BUCKET_NAME,
      Key: file.s3Key,
    });

    const url = await getSignedUrl(s3, cmd, { expiresIn: 60 }); // seconds
    return res.json({ url });
  } catch (err) {
    next(err);
  }
};

export const getUserFiles = async (req, res, next) => {
  try {
    const files = await FileUpload.find({ owner: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ files });
  } catch (error) {
    next(error);
  }
};
