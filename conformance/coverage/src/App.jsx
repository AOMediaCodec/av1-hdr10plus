import clsx from "clsx";
import { useMemo, useRef, useState } from "preact/hooks";
import { FiDownload } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import { useOnClickOutside } from "usehooks-ts";
import coverage_raw from "../../coverage.json";

const BASE_URL = "https://aomediacodec.github.io/av1-hdr10plus/";
const GIT_REPO =
    "https://github.com/AOMediaCodec/av1-hdr10plus/raw/main/conformance";

const FilePopover = ({ files }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useOnClickOutside(ref, () => setOpen(false));

    const download = (file) => {
        window.open(`${GIT_REPO}/${file.file_path}`);
    };

    return (
        <>
            <button
                className="w-full text-blue-600 hover:text-blue-500 hover:underline"
                onClick={() => setOpen(true)}
            >
                {files.length}
            </button>
            <div
                className={clsx(
                    "fixed left-0 top-0 z-20 h-screen w-screen items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm backdrop-filter",
                    open ? "flex" : "hidden"
                )}
            >
                <div
                    ref={ref}
                    className="relative max-h-[50%] rounded-lg bg-white p-8 flex"
                >
                    <div className="absolute -top-2 left-0 flex w-full -translate-y-full flex-row items-center justify-between px-4">
                        <h1 className="text-4xl text-white">
                            {files.length} files found
                        </h1>
                        <IoCloseOutline
                            onClick={() => setOpen(false)}
                            className="cursor-pointer text-6xl text-white"
                        />
                    </div>
                    <div className="scroll flex flex-[1] flex-col items-stretch gap-4 overflow-scroll">
                        {files.map((file) => (
                            <div
                                key={file.file_path}
                                className="flex flex-row items-center justify-between gap-4 border-l-4 border-yellow-400 px-2"
                            >
                                <div className="flex flex-col items-start">
                                    <span className="text-xl">
                                        {file.file_path
                                            .split("/")
                                            .slice(1)
                                            .join("/")}
                                    </span>
                                    <p className="max-w-lg whitespace-normal text-start text-sm font-light">
                                        {file.description}
                                    </p>
                                </div>
                                <FiDownload
                                    onClick={() => download(file)}
                                    className="cursor-pointer text-2xl duration-100 hover:text-blue-500"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default function App() {
    const coverage = useMemo(() => {
        const covered = {
            successful: [],
            error: [],
            warning: [],
            percentage: 0,
        };
        const not_covered = [];
        const excluded = [];

        for (const assert of coverage_raw["rules"]) {
            if (assert.exclude) {
                excluded.push({
                    id: assert.id,
                    description: assert.description,
                });
                continue;
            }

            if (assert.successful_checks.length > 0) {
                covered.successful.push({
                    id: assert.id,
                    description: assert.description,
                    files: assert.successful_checks,
                });
            }

            if (assert.errors.length > 0) {
                covered.error.push({
                    id: assert.id,
                    description: assert.description,
                    files: assert.errors,
                });
            }

            if (assert.warnings.length > 0) {
                covered.warning.push({
                    id: assert.id,
                    description: assert.description,
                    files: assert.warnings,
                });
            }

            if (
                assert.successful_checks.length === 0 &&
                assert.errors.length === 0 &&
                assert.warnings.length === 0
            ) {
                not_covered.push({
                    id: assert.id,
                    description: assert.description,
                    files: [],
                });
            }
        }

        covered.percentage =
            1 - not_covered.length / coverage_raw["rules"].length;

        return {
            covered,
            not_covered,
            excluded,
        };
    }, []);

    return (
        <div className="container mx-auto flex w-full flex-col gap-6 p-8">
            <div className="flex flex-row justify-between gap-12">
                <div className="flex flex-col gap-4">
                    <h1 className="text-4xl font-thin tracking-tight">
                        HDR10+ AV1 Metadata Handling Specification Coverage
                        Report
                    </h1>
                    <span>
                        <a
                            className="text-blue-500 underline"
                            href="https://github.com/gpac/ComplianceWarden"
                        >
                            Compliance Warden
                        </a>{" "}
                        version: {coverage_raw["cw_version"]}
                    </span>
                    <span className="border-l-4 border-red-400 pl-2 text-xl">
                        <b>WARNING: </b> These files are still{" "}
                        <u>under review.</u>
                    </span>
                </div>
                <h2 className="text-[72px] font-semibold">
                    {(coverage.covered.percentage * 100).toFixed(2)}%
                </h2>
            </div>
            <div className="flex flex-row items-start justify-between gap-6">
                <div className="flex flex-[1] flex-col items-stretch justify-center gap-6">
                    <table className="border-1">
                        <thead>
                            <tr>
                                <th colSpan={3}>
                                    <h3 className="bg-black text-xl font-bold text-white">
                                        Covered
                                    </h3>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-green-400">
                                <th colSpan={3}>Successful</th>
                            </tr>
                            <tr className="bg-green-400">
                                <th># of files</th>
                                <th>Assert ID</th>
                                <th>Description</th>
                            </tr>
                            {coverage.covered.successful.map((item) => (
                                <tr key={item.id}>
                                    <td className="text-center">
                                        <FilePopover files={item.files} />
                                    </td>
                                    <td className="text-center">
                                        <a
                                            className="text-blue-600 hover:text-blue-500 hover:underline"
                                            href={`${BASE_URL}#${item.id}`}
                                        >
                                            {item.id}
                                        </a>
                                    </td>
                                    <td className="whitespace-normal">
                                        {item.description}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <table className="border-1">
                        <thead>
                            <tr>
                                <th colSpan={3}>
                                    <h3 className="bg-black text-xl font-bold text-white">
                                        Covered (invalid files on purpose)
                                    </h3>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-red-400">
                                <th colSpan={3}>Successful</th>
                            </tr>
                            <tr className="bg-red-400">
                                <th># of files</th>
                                <th>Assert ID</th>
                                <th>Description</th>
                            </tr>
                            {coverage.covered.error.map((item) => (
                                <tr key={item.id}>
                                    <td className="text-center">
                                        <FilePopover files={item.files} />
                                    </td>
                                    <td className="text-center">
                                        <a
                                            className="text-blue-600 hover:text-blue-500 hover:underline"
                                            href={`${BASE_URL}#${item.id}`}
                                        >
                                            {item.id}
                                        </a>
                                    </td>
                                    <td className="whitespace-normal">
                                        {item.description}
                                    </td>
                                </tr>
                            ))}
                            <tr className="bg-yellow-400">
                                <th colSpan={3}>Warning</th>
                            </tr>
                            {coverage.covered.warning.map((item) => (
                                <tr key={item.id}>
                                    <td className="text-center">
                                        <FilePopover files={item.files} />
                                    </td>
                                    <td className="text-center">
                                        <a
                                            className="text-blue-600 hover:text-blue-500 hover:underline"
                                            href={`${BASE_URL}#${item.id}`}
                                        >
                                            {item.id}
                                        </a>
                                    </td>
                                    <td className="whitespace-normal">
                                        {item.description}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex flex-[1] flex-col items-stretch justify-center gap-6">
                    <table className="flex-[1] border-1">
                        <thead>
                            <tr>
                                <th colSpan={2}>
                                    <h3 className="bg-black text-xl font-bold text-white">
                                        Not Covered
                                    </h3>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-neutral-400">
                                <th>Assert ID</th>
                                <th>Description</th>
                            </tr>
                            {coverage.not_covered.map((item) => (
                                <tr key={item.id}>
                                    <td className="text-center">
                                        <a
                                            className="text-blue-600 hover:text-blue-500 hover:underline"
                                            href={`${BASE_URL}#${item.id}`}
                                        >
                                            {item.id}
                                        </a>
                                    </td>
                                    <td className="whitespace-normal">
                                        {item.description}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {coverage.excluded.length > 0 && (
                        <table className="flex-[1] border-1 opacity-40">
                            <thead>
                                <tr>
                                    <th colSpan={2}>
                                        <h3 className="bg-black text-xl font-bold text-white">
                                            Excluded from coverage report
                                        </h3>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-neutral-400">
                                    <th>Assert ID</th>
                                    <th>Description</th>
                                </tr>
                                {coverage.excluded.map((item) => (
                                    <tr key={item.id}>
                                        <td className="text-center">
                                            <a
                                                className="text-blue-600 hover:text-blue-500 hover:underline"
                                                href={`${BASE_URL}#${item.id}`}
                                            >
                                                {item.id}
                                            </a>
                                        </td>
                                        <td className="whitespace-normal">
                                            {item.description}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
