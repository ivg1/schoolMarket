import { createTheme } from "flowbite-react";

// todo: instead of using flowbite components, later switch to material UI because i like it better
export const lightTheme = createTheme({
    navbar: {
        root: {
            base: "bg-white/50 px-2 py-2 shadow-sm backdrop-blur-md",
        },
        link: {
            base: "block py-2 pl-3 pr-4 md:p-0",
            active: {
                on: "font-semibold text-red-600 md:bg-transparent md:text-red-600",
                off: "border-b border-transparent text-slate-600 hover:text-slate-900 md:border-0 md:hover:bg-transparent md:hover:text-red-600",
            },
        },
        toggle: {
            base: "focus:outline-none focus:ring-1 focus:ring-red-200 text-red-600"
        },
        collapse: {
            base: "text-black"
        }

    },

    button: {
        color: {
            alternative: "border border-slate-300 bg-white text-slate-900 hover:bg-slate-100 focus:ring-red-200 hover:text-red-500 hover:cursor-pointer",
            light: "border border-slate-300 bg-slate-50 text-slate-900 hover:bg-slate-100 focus:ring-slate-200 hover:text-red-500 hover:cursor-pointer",
            red: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-200 hover:cursor-pointer",
            default: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-200 hover:cursor-pointer",
			bgless: "bg-transparent text-slate-900 hover:bg-slate-100 focus:ring-slate-200 hover:text-red-600 hover:cursor-pointer",
			bglessOnlytext: "bg-transparent text-slate-900 hover:text-red-600 focus:ring-slate-200 p-2 hover:cursor-pointer",
            sidebarButton: "bg-transparent text-gray-600 hover:text-red-600 hover:cursor-pointer hover:bg-gray-100 flex justify-start gap-2"
        },
    },
    accordion: {
        root: {
            base: "divide-y divide-slate-200 border-slate-200",
            flush: {
                off: "rounded-2xl border",
                on: "border-b",
            },
        },
        content: {
            base: "bg-white p-5 first:rounded-t-lg last:rounded-b-lg",
        },
        title: {
            arrow: {
                base: "h-6 w-6 shrink-0",
                open: {
                    off: "",
                    on: "rotate-180",
                },
            },
            base: "flex w-full items-center justify-between p-5 text-left font-medium text-slate-600 first:rounded-t-lg last:rounded-b-lg",
            flush: {
                off: "hover:bg-slate-50 focus:ring-2 focus:ring-slate-200",
                on: "bg-transparent",
            },
            heading: "",
            open: {
                off: "",
                on: "bg-slate-100 text-slate-900",
            },
        },
    },
    blockquote: {
        root: {
            base: "text-xl font-semibold italic text-slate-900",
        },
    },
    avatar: {
        root: {
            base: ""
        }
    },
    textInput: {
        field: {
            input: {
                colors: {
                    gray: "focus:border-red-600 focus:ring-red-600"
                }
            }
        }
    },
    textarea: {
        base: "",
        colors: {
            gray: "focus:border-red-600 focus:ring-red-600"
        }
    },
    fileInput: {
        base: "file:bg-red-600 file:text-white file:placeholder-gray-400 hover:file:bg-red-700",
        colors: {
            gray: "focus:border-red-600 focus:ring-red-600"
        }
    },
    toast: {
        root: {
            base: "rounded-xl bg-red-100 text-red-800 p-4 fixed top-0 left-0 m-4 z-9999 min-w-[98vw] max-w-[98vw] "
        },
        toggle: {
            base: "bg-red-100 hover:bg-red-200 text-red-800 hover:text-red-800"
        }
    },
    /* i dont wanna style this component anymore, ill just make my own settings sidebar.
    sidebar: {
        root: {
            base: "",
            inner: "bg-white rounded-2xl py-3"
        },
        collapse: {
            button: "rounded-2xl hover:bg-red-300",
            icon: {
                base: "text-red-600",
                open: {
                    on: "text-red-600"
                }
            }
        }
    }
    */
    drawer: {
        root: {
            base: "",
        }
    },
    checkbox: {
        base: "rounded-sm"
    },

    select: {
        field: {
            select: {
                base: "",
                colors: {
                    gray: "focus:border-red-600 focus:ring-red-600"
                }
            }
        }
    },
    radio: {
        base: "min-w-4 min-h-3"
    },
});

export const darkTheme = createTheme({
    navbar: {
        root: {
            base: "dark:bg-(--darkbg)/50 dark:backdrop-blur-md px-2 py-2.5 dark:shadow-sm sm:px-4 dark:z-4000",
        },
        link: {
            base: "block py-2 pl-3 pr-4 md:p-0",
            active: {
                on: "dark:font-semibold dark:text-red-600 dark:md:bg-transparent dark:md:text-red-600",
                off: "dark:border-b dark:border-transparent dark:md:border-0 dark:md:hover:bg-transparent dark:md:hover:text-red-600 dark:hover:bg-(--darkbutton-1)",
            },
        },
        collapse: {
            base: "w-full md:block md:w-auto",
            list: "mt-4 flex flex-col md:mt-0 md:flex-row md:space-x-8 md:text-sm md:font-medium",
            hidden: {
                on: "hidden",
                off: ""
            }
        },
        toggle: {
            base: "dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-red-700 dark:text-red-700"
        },
    },
    button: {
        color: {
            alternative: "dark:border dark:border-[#494949] dark:hover:border-red-600 dark:bg-(--darkbutton-1) dark:text-slate-100 dark:hover:bg-(--darkbutton-2) dark:hover:text-red-600 dark:focus:ring-red-700 dark:hover:cursor-pointer",
            light: "dark:border dark:border-[#494949] dark:hover:border-red-600 dark:bg-(--darkbutton-1) dark:text-slate-100 dark:hover:bg-(--darkbutton-2) dark:hover:text-red-600 dark:focus:ring-slate-700 dark:hover:cursor-pointer",
            red: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400 hover:cursor-pointer",
            default: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400 hover:cursor-pointer",
			bgless: "bg-transparent text-shadow-white hover:text-red-600 hover:cursor-pointer",
			bglessOnlytext: "bg-transparent text-shadow-white hover:text-red-600 focus:ring-slate-200 p-2 hover:cursor-pointer",
            sidebarButton: "bg-transparent text-gray-300 hover:text-red-700 hover:cursor-pointer hover:bg-(--darksurface) flex justify-start gap-2"
        },
    },
    accordion: {
        root: {
            base: "dark:border-(--darkborder)",
            flush: {
                off: "rounded-2xl border ",
                on: "border-b",
            },
        },
        content: {
            base: "dark:bg-(--darkbg) p-5 first:rounded-t-lg last:rounded-b-lg",
        },
        title: {
            arrow: {
                base: "h-6 w-6 shrink-0 ",
                open: {
                    off: "",
                    on: "rotate-180",
                },
            },
            base: "flex w-full items-center justify-between p-5 text-left font-medium text-slate-600 first:rounded-t-lg last:rounded-b-lg dark:border-(--darkborder)",
            flush: {
                off: "dark:hover:bg-(--darksurface) dark:focus:ring-2 dark:focus:ring-slate-200",
                on: "dark:bg-transparent",
            },
            heading: "",
            open: {
                off: "",
                on: "dark:bg-(--darksurface) text-slate-900",
            },
        },
    },
    avatar: {
        root: {
            base: "",
            img: {
                base: "object-cover"
            }
        }
    },
    hr: {
        root: {
            base: "dark:bg-(--darkborder)"
        },
        trimmed: {
            base: "dark:bg-(--darksurface-2)"
        },
    },
    textInput: {
        field: {
            input: {
                colors: {
                    gray: "dark:border-(--darkborder) dark:bg-(--darkbutton-1) dark:text-white dark:placeholder-gray-400 dark:focus:border-red-600 dark:focus:ring-red-600"
                }
            }
        }
    },
    checkbox: {
        base: "dark:bg-(--darkbutton-1) rounded-sm"
    },
    radio: {
        base: "dark:bg-(--darkbutoton) min-w-4 min-h-3"
    },
    textarea: {
        base: "",
        colors: {
            gray: "dark:border-(--darkborder) dark:bg-(--darkbutton-1) dark:text-white dark:placeholder-gray-400 dark:focus:border-red-600 dark:focus:ring-red-600"
        }
    },
    fileInput: {
        base: "dark:file:bg-(--darksurface) dark:file:text-white dark:file:placeholder-gray-400 dark:hover:file:bg-(--darksurface-2)",
        colors: {
            gray: "dark:border-(--darkborder) dark:bg-(--darkbg) dark:text-white dark:focus:border-red-600 dark:focus:ring-red-600"
        }
    },
    dropdown: {
        floating: {
            style: {
                auto: "dark:bg-(--darksurface-2)"
            },
            item: {
                base: "sm:dark:hover:bg-red-800"
            }
        }
    },
    drawer: {
        root: {
            base: "dark:bg-(--darksurface)",
            backdrop: "dark:bg-(--darkbg)/80"
        }
    },
    toast: {
        root: {
            base: "dark:rounded-xl dark:bg-red-800 dark:text-red-200 dark:m-4 dark:p-4 dark:min-w-[98vw] dark:max-w-[98vw] dark:z-9999 dark:fixed dark:top-0 dark:left-0"
        },
        toggle: {
            base: "dark:bg-red-800 dark:text-red-400 dark:hover:bg-red-700 dark:hover:text-red-200"
        }
    },
    select: {
        field: {
            select: {
                base: "",
                colors: {
                    gray: "dark:border-(--darkborder) dark:bg-(--darkbutton-1) dark:text-white dark:placeholder-gray-400 dark:focus:border-red-600 dark:focus:ring-red-600"
                }
            }
        }
    },

});

export default darkTheme;