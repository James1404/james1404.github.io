import { useState } from "react";
import {
    runInterpreter,
    GetErrors,
    type KiltValue,
    type KiltError,
} from "./interpreter";

export default function Calculator() {
    const [result, setResult] = useState<KiltValue | undefined>();
    const [errors, setErrors] = useState<KiltError[] | undefined>();

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const data = new FormData(e.currentTarget);

        const input = data.get("input");

        if (input) {
            setResult(runInterpreter(input.toString()));
            setErrors(GetErrors());
        }
    };

    return (
        <div className="max-md:mx-auto flex flex-col gap-1 max-sm:items-center w-1/2">
            <form
                onSubmit={submit}
                className="flex flex-col sm:flex-row gap-1 w-full"
            >
                <input
                    type="text"
                    name="input"
                    className="grow"
                    placeholder="input ..."
                />
                <input
                    type="submit"
                    value="Calculate"
                    className="!text-white !bg-black"
                />
            </form>

            {result ? <p>Result: {result} </p> : <></>}

            {errors ? (
                <div className="bg-red-600 text-white max-h-[50vh] w-full p-5 rounded overflow-y-scroll">
                    {errors.map((err, idx) => (
                        <p key={idx}>{err.msg}</p>
                    ))}
                </div>
            ) : (
                <></>
            )}
        </div>
    );
}
