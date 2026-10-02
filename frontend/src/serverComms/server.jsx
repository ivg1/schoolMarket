import Auth from "../auth/auth";

const url = "/api"; //192.168.10.153:3000

export const Server = {
    listings: {
        modUrl: `${url}/listings`,
        async getOne(id) {
            const response = await fetch(`${this.modUrl}/read?id=${encodeURIComponent(id)}`);
            return await response.json();
        },
        async getAll() {
            const response = await fetch(`${this.modUrl}/getAll`);
            const result = await response.json();
            console.log(result);
            return result;
        },
        async getNum() {
            const response = await fetch(`${this.modUrl}/getNum`);
            const result = await response.json();
            return result;
        },
        async getAllByUser(body) {
            const token = await Auth.getToken();
            const response = await fetch(`${this.modUrl}/getAllByUser`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token
                },
                body: JSON.stringify(body ?? {})
            });
            const result = await response.json();
            console.log(result);
            return result;
        },
        async create(body) {
            const token = await Auth.getToken();
            console.log(token);
            const response = await fetch(`${this.modUrl}/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token
                },
                body: JSON.stringify(body ?? {})
            });
            //should put this everywhere else too.
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }
            return await response.json();
        },
        async update(body) {
            //const response = await fetch(`${this.modUrl}/update?id=${encodeURIComponent(id)}`, {
            const token = await Auth.getToken();
            const response = await fetch(`${this.modUrl}/update`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token
                },
                //rn i have id and seller id in body too
                body: JSON.stringify(body ?? {})
            });
            if (!response.ok) throw new Error("updating listing failed");

            return await response.json();
        },
        async delete(body) {
            const token = await Auth.getToken();
            const response = await fetch(`${this.modUrl}/delete`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token
                },
                body: JSON.stringify(body ?? {})
                //todo: add a body with username and pass or something to see if actual and not attack
            });
            if (!response.ok) throw new Error("failed deleting listing (in server file)");

            return await response.json();
        },
        mods: {
            modUrl: `${url}/listings/formods`,
            async getAll() {
                const token = await Auth.getToken();
                const response = await fetch(`${this.modUrl}/getAll`, {
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token
                },
                });
                const result = await response.json();
                console.log(result);
                return result;
            },
            async accept(body) {
                const token = await Auth.getToken();
                const response = await fetch(`${this.modUrl}/accept`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token
                    },
                    body: JSON.stringify(body ?? {})
                });
                const result = await response.json();
                console.log(result);
                return result;
            },
            async reject(body) {
                const token = await Auth.getToken();
                const response = await fetch(`${this.modUrl}/reject`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token
                    },
                    body: JSON.stringify(body ?? {})
                });
                const result = await response.json();
                console.log(result);
                return result;
            }
        }
    },
    users: {
        modUrl: `${url}/users`,
        async getData(id) {
            const response = await fetch(`${this.modUrl}/getById?id=${encodeURIComponent(id)}`);
            return await response.json();
        },
        async numUsers() {
            const token = await Auth.getToken();
            const response = await fetch(`${this.modUrl}/getNum`, {
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token
                }
            });
            //console.log(response);
            return await response.json();
        },
        async getDataByUsername(username) {
            const token = await Auth.getToken();
            const response = await fetch(`${this.modUrl}/getDataByUsername?username=${encodeURIComponent(username)}`, {
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token
                }
            });
            return await response.json();
        },

        //new thing im doing rn, dont forget to finish
        async update(body) {
            const token = await Auth.getToken();
            const response = await fetch(`${this.modUrl}/update`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token
                },
                body: JSON.stringify(body ?? {})
            });
            return await response.json();
        },
        private: {
            modUrl: `${url}/users/private`,
            async getDataById(id) {
                const token = await Auth.getToken();
                const response = await fetch(`${this.modUrl}/getDataById`, {
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token
                    }
                });
                return await response.json();
            },
            async resetPass(body) {
                const token = await Auth.getToken();
                const response = await fetch(`${this.modUrl}/resetPass`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token
                    },
                    body: JSON.stringify(body ?? {})
                });
                if (response.status === 401) throw new Error("Wrong current password")
                if (!response.ok) throw new Error("failed resetting password");
                return await response.json();
            }
        },


        async setMod(body) {
            const token = await Auth.getToken();
            const response = await fetch(`${this.modUrl}/admins/setMod`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token
                },
                body: JSON.stringify(body ?? {})
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }
            return await response.json();
        },
        async removeMod(body) {
            const token = await Auth.getToken();
            const response = await fetch(`${this.modUrl}/admins/removeMod`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token
                },
                body: JSON.stringify(body ?? {})
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }
            return await response.json();
        },

        async getAll() {
            const token = await Auth.getToken();
            const response = await fetch(`${this.modUrl}/getAll`, {
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token
                }
            });
            if (!response.ok) throw new Error("Fobidden");
            //console.log(await response.json());
            return await response.json();
        },
        
        danger: {
            modUrl: `${url}/users/danger`,
            async delete(body) {
                const token = await Auth.getToken();
                const response = await fetch(`${this.modUrl}/delete`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token
                    },
                    body: JSON.stringify(body ?? {})
                });
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message);
                }
                //console.log(await response.json());
                return await response.json();
            }
        }
    },
    auth: {
        modUrl: `${url}/auth`,
        async signup(body) {
            const response = await fetch(`${this.modUrl}/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });
            
            if (!response.ok) throw new Error("SIGNUP FAILED");
            return await response.json();
        },
        async login(body) {
            const response = await fetch(`${this.modUrl}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) throw new Error("WRONG CREDENTIALS"); //geez, how could i have forgotten to add this???
            return await response.json();
        }
    },
    async uploadImage(image) {
        //debug in case
        //console.log(image);
        //console.log(typeof image);
        //console.log(image instanceof File);
        //console.log(image.name);
        //console.log(image.size);
        //console.log(image.type);

        const formData = new FormData();
        formData.append("file", image);

        const response = await fetch(`${url}/upload`, {
            method: "POST",
            body: formData
        });

        console.log("status:", response.status);

        if (!response.ok) throw new Error("image upload failed");

        return await response.json();
    },
    async me() {
        const token = await Auth.getToken();
        const response = await fetch(`${url}/me`, {
            headers: {
                "Content-Type": "application/json",
                "x-access-token": token
            }
        });

        if (!response.ok) throw new Error("you seem to not exist mate");
        return await response.json();
    },
};

export default Server;
