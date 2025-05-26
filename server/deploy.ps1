$projectId = "multidom-460607"
$region = "europe-west4"
$repo = "multidom-repo"
$imageName = "multidom-server"
$containerImage = "$region-docker.pkg.dev/$projectId/$repo/$imageName"

docker build -t $imageName .

docker tag $imageName $containerImage
docker push $containerImage

gcloud run deploy $imageName `
  --image $containerImage `
  --region $region `
  --platform managed `
  --allow-unauthenticated `
  --min-instances 0 `
  --max-instances 1 `
