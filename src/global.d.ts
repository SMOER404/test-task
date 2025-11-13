declare module '*.scss' {
    interface IClassNames {
        [className: string]: string
    }

    const classnames: IClassNames;
    export = classnames;
}

declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
}

declare module '*.module.scss' {
    const classes: { [key: string]: string };
    export default classes;
}

declare module '*.module.sass' {
    const classes: { [key: string]: string };
    export default classes;
}