/* eslint-disable @next/next/no-img-element */
export interface TestifierObject {
  name: string;
  role: string;
  testimonial: string;
  org_image: string;
  testifier_image: string;
}

interface TestimonyComponentProps {
  testimonyObject: TestifierObject;
}

export default function TestimonyComponent({
  testimonyObject,
}: TestimonyComponentProps) {
  const { name, role, testimonial, org_image, testifier_image } =
    testimonyObject;
  return (
    <section className="relative isolate overflow-hidden bg-transparent px-6 pb-12 lg:px-8">
      <div className="mx-auto max-w-lg lg:max-w-4xl">
        <img className="mx-auto h-4" src={org_image} alt="" />
        <figure className="mt-3">
          <blockquote className="text-center text-lg font-light leading-7 text-gray-900 sm:text-2xl sm:leading-8">
            <p>&quot;{testimonial}&quot;</p>
          </blockquote>
          <figcaption className="mt-4">
            <img
              className="mx-auto h-20 w-20 rounded-full object-cover"
              src={testifier_image}
              alt=""
            />
            <div className="mt-4 flex flex-col items-center justify-center space-x-3 text-base">
              <div className="font-semibold text-gray-900">{name}</div>
              <div className="text-gray-600">{role}</div>
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
