export const Title =(props:{title: string})=>{
    return (
        <h2 className="lg:text-5xl md:text-4xl text-3xl text-indigo-500 underline mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>{props.title}</h2>
    );
}

export default Title;