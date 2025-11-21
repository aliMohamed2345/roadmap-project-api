
export const getGrade = (percentage) => {
    let grade;
    if (percentage >= 90) grade = "A+";
    else if (percentage >= 80) grade = "A";
    else if (percentage >= 70) grade = "B";
    else if (percentage >= 60) grade = "C";
    else if (percentage >= 50) grade = "D";
    else grade = "F";

    const status = grade === "F" ? "Failed" : "Passed";
    return { grade, status }
}