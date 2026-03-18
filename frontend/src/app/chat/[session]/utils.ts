export async function get_upload_url(user_id: Number, file:File){
    let req = await fetch(`http://localhost:8000/upload/?user_id=${user_id}&filename=${file.name}`)
        const upload_data = await req.json()
        return upload_data
}