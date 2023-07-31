
declare const AWS: any;

// @ts-ignore
import env from '/environment.js';

export const pushToS3 = (data: Blob, name: string) => {
  const albumPhotosKey = encodeURIComponent(env.album) + '/';
  const photoKey = albumPhotosKey + name;

  //Bucket Configurations
  const bucketName = env.bucket;
  const bucketRegion = env.region;
  const IdentityPoolId = env.poolid;

  AWS.config.update({
    region: bucketRegion,
    credentials: new AWS.CognitoIdentityCredentials({
      IdentityPoolId: IdentityPoolId
    })
  });

  // Use S3 ManagedUpload class as it supports multipart uploads
  const upload = new AWS.S3.ManagedUpload({
    params: {
      Bucket: bucketName,
      Key: photoKey,
      Body: data
    }
  });

  const promise = upload.promise();

  promise.then(
    function(_data: any) {
      //console.log('uploaded')
    },
    function(err: any) {
      alert("There was an error uploading your photo: " + err.message);
    }
  );
}