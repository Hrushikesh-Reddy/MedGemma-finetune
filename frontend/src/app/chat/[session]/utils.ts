export async function get_upload_url(user_id: String | null, file:File){
    if(user_id){
    let res = await fetch(`http://localhost:8000/upload/?user_id=${user_id}&filename=${file.name}`)
        const upload_data = await res.json()
        return upload_data}
}