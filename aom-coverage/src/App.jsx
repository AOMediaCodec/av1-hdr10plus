import { useMemo } from "preact/hooks";
import coverage_raw from "../../conformance/coverage.json";

export default function App() {
    const coverage = useMemo(() => {
        const covered = {
            successful: [],
            error: [],
            warning: [],
            file_counts: {
                successful: {},
                error: {},
                warning: {},
            },
            percentage: 0,
        };
        const not_covered = [];

        for (const assert of coverage_raw) {
            if (assert.successful_checks.length > 0) {
                covered.successful.push({
                    id: assert.id,
                    description: assert.description,
                });
                covered.file_counts.successful[assert.id] =
                    assert.successful_checks.length;
            }

            if (assert.errors.length > 0) {
                covered.error.push({
                    id: assert.id,
                    description: assert.description,
                });
                covered.file_counts.error[assert.id] = assert.errors.length;
            }

            if (assert.warnings.length > 0) {
                covered.warning.push({
                    id: assert.id,
                    description: assert.description,
                });
                covered.file_counts.warning[assert.id] = assert.warnings.length;
            }

            if (
                assert.successful_checks.length === 0 &&
                assert.errors.length === 0 &&
                assert.warnings.length === 0
            ) {
                not_covered.push({
                    id: assert.id,
                    description: assert.description,
                });
            }
        }

        covered.percentage = 1 - not_covered.length / coverage_raw.length;

        return {
            covered,
            not_covered,
        };
    }, []);

    return (
        <div className="flex w-full flex-col gap-6 p-8">
            <h1 className="text-4xl font-thin tracking-tight">
                AOM Coverage Report
            </h1>
            <h2 className="text-2xl font-bold">
                {(coverage.covered.percentage * 100).toFixed(2)}% covered
            </h2>
            <div className="flex flex-row items-stretch justify-between gap-6">
                <table className="border-1">
                    <thead>
                        <tr>
                            <th colSpan={2}>
                                <h3 className="bg-black text-xl font-bold text-white">
                                    Covered
                                </h3>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="bg-green-400">
                            <td colSpan={2}>
                                <th>Successful</th>
                            </td>
                        </tr>
                        <tr className="bg-green-400">
                            <td>
                                <th># of files</th>
                            </td>
                            <td>
                                <th>Description</th>
                            </td>
                        </tr>
                        {coverage.covered.successful.map((item) => (
                            <tr key={item.id}>
                                <td className="w-36 text-center">
                                    {
                                        coverage.covered.file_counts.successful[
                                            item.id
                                        ]
                                    }
                                </td>
                                <td>{item.description}</td>
                            </tr>
                        ))}
                        <tr className="bg-red-400">
                            <td colSpan={2}>
                                <th>Error</th>
                            </td>
                        </tr>
                        {coverage.covered.error.map((item) => (
                            <tr key={item.id}>
                                <td className="w-36 text-center">
                                    {
                                        coverage.covered.file_counts.error[
                                            item.id
                                        ]
                                    }
                                </td>
                                <td>{item.description}</td>
                            </tr>
                        ))}
                        <tr className="bg-yellow-400">
                            <td colSpan={2}>
                                <th>Warning</th>
                            </td>
                        </tr>
                        {coverage.covered.warning.map((item) => (
                            <tr key={item.id}>
                                <td className="w-36 text-center">
                                    {
                                        coverage.covered.file_counts.warning[
                                            item.id
                                        ]
                                    }
                                </td>
                                <td>{item.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <table className="border-1">
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
                            <td>
                                <th>ID</th>
                            </td>
                            <td>
                                <th>Description</th>
                            </td>
                        </tr>
                        {coverage.not_covered.map((item) => (
                            <tr key={item.id}>
                                <td className="w-36 text-center">{item.id}</td>
                                <td>{item.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
