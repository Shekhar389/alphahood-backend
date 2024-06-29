import { app } from './app.js'

// connectDB()
//     .then(() => {
//         app.listen(process.env.PORT || 8080, () => {
//             console.log(`Server is running at port : ${process.env.PORT}`);
//         })
//     })
//     .catch((err) => {
//         console.log("MONGO db connection failed !!! ", err);
//     })

app.listen(process.env.PORT || 8080, () => {
    console.log(`Server is running at port : ${process.env.PORT}`);
})