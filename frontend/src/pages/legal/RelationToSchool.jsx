import { Link } from "react-router-dom";

export default function RelationToSchool() {
    return (
        <div className="min-h-screen">
            <div className="flex flex-col items-center px-10 pb-60">
                <div className="explanation flex flex-col items-center mb-20">
                    <div>
                        <h1 className="text-8xl font-bold my-20 flex flex-col md:items-end dark:text-(--darktext)">
                            Relation To The School
                        </h1>
                    </div>
                    <div className="flex flex-col gap-8 md:px-10 max-w-300">
                        <div className="text-left">
                            <p className="text-xl mb-8">
                                School Market (SM) is a platform made to help members of schools to buy/sell/trade goods and services.
                            </p>
                            <p className="text-xl mb-8">
                                SM is not owned, operated, sponsored, or affiliated with any school.
                            </p>
                            <p className="text-xl mb-8">
                                While SM is not operated by any school, users are expected to follow common school rules that apply to the content of SM, as stated in the terms of service.
                            </p>
                            <p className="text-xl mb-8">
                                If SM receives requests from schools regarding safety or policy compliance, SM administrators may take appropriate action, such as removing and banning specific content and users.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}