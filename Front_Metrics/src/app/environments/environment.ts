/* CIMMYT */
export const Environment = {

    CLIENT_ID: 'e0f0e1e2-8dfc-41c8-bc60-1cb97b2bdc98',
    AUTHORITY: "https://login.microsoftonline.com/da1068b1-9955-40c3-a728-451a21599bb3",
    /* REDIRECT_URI: 'https://localhost:4200/',
    API_URL: 'http://localhost:3000/', */

    REDIRECT_URI: 'https://cimmyt-project-management.cimmyt.org/',
    API_URL: 'https://cimmyt-project-management.cimmyt.org:8443/',

    projectId: '', // Variable para almacenar el ID
    getProjectId: () => Environment.projectId, // Función getter para obtener el ID
    setProjectId: (id: string) => { Environment.projectId = id; }, // Función setter para establecer el ID

    username: '', // Variable para almacenar el ID
    getusername: () => Environment.username, // Función getter para obtener el ID
    setusername: (name: string) => { Environment.username = name; }, // Función setter para establecer el ID

    Token: '', // Variable para almacenar el ID
    getToken: () => Environment.Token, // Función getter para obtener el ID
    setToken: (accesstoken: string) => { Environment.Token = accesstoken; } // Función setter para establecer el ID
}


/* CGIAR */
/* export const Environment = {
    CLIENT_ID: '073d3861-ab61-4451-b8a7-0df804129f13',
    REDIRECT_URI: 'http://localhost:4200/',
    AUTHORITY: "https://login.microsoftonline.com/6afa0e00-fa14-40b7-8a2e-22a7f8c357d5",
} */

/* DEV CREDENTIALS */
/*

    CLIENT_ID: 'e0f0e1e2-8dfc-41c8-bc60-1cb97b2bdc98',
    REDIRECT_URI: 'https://localhost:4200/',
    API_URL: 'http://localhost:3000/',

*/
