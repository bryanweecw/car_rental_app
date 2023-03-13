import { string } from "zod";


export interface TestifierObject{
    name: string;
    role: string;
    testimonial: string;
    org_image: string;
    testifier_image:string;
}

interface TestimonyComponentProps{
    testimonyObject: TestifierObject
}

export default function TestimonyComponent({testimonyObject}: TestimonyComponentProps) {
    const {name, role, testimonial, org_image, testifier_image} = testimonyObject;
    return (
        <section className="relative isolate overflow-hidden bg-white px-6 sm:py-12 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] opacity-20" />
        <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
            <img className="mx-auto h-4" src= { org_image } alt="" />
            <figure className="mt-10">
            <blockquote className="text-center text-xl font-semibold leading-8 text-gray-900 sm:text-2xl sm:leading-9">
                <p>
                { testimonial }
                </p>
            </blockquote>
            <figcaption className="mt-4">
                <img
                className="mx-auto object-contain h-20 w-20 rounded-full"
                src= { testifier_image }
                alt=""
                />
                <div className="mt-4 flex flex-col items-center justify-center space-x-3 text-base">
                <div className="font-semibold text-gray-900">{ name }</div>
                <div className="text-gray-600">{ role }</div>
                </div>
            </figcaption>
            </figure>
        </div>
        </section>
        )
}


