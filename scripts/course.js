document.addEventListener("DOMContentLoaded", function () {

    const courses = [
        {
            subject: 'CSE',
            number: 110,
            title: 'Introduction to Programming',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.',
            technology: [
                'Python'
            ],
            completed: true
        },
        {
            subject: 'WDD',
            number: 130,
            title: 'Web Fundamentals',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'This course introduces students to the World Wide Web and to careers in web site design and development. The course is hands on with students actually participating in simple web designs and programming. It is anticipated that students who complete this course will understand the fields of web design and development and will have a good idea if they want to pursue this degree as a major.',
            technology: [
                'HTML',
                'CSS'
            ],
            completed: true
        },
        {
            subject: 'CSE',
            number: 111,
            title: 'Programming with Functions',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'CSE 111 students become more organized, efficient, and powerful computer programmers by learning to research and call functions written by others; to write, call , debug, and test their own functions; and to handle errors within functions. CSE 111 students write programs with functions to solve problems in many disciplines, including business, physical science, human performance, and humanities.',
            technology: [
                'Python'
            ],
            completed: true
        },
        {
            subject: 'CSE',
            number: 210,
            title: 'Programming with Classes',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'This course will introduce the notion of classes and objects. It will present encapsulation at a conceptual level. It will also work with inheritance and polymorphism.',
            technology: [
                'C#'
            ],
            completed: false
        },
        {
            subject: 'WDD',
            number: 131,
            title: 'Dynamic Web Fundamentals',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'This course builds on prior experience in Web Fundamentals and programming. Students will learn to create dynamic websites that use JavaScript to respond to events, update content, and create responsive user experiences.',
            technology: [
                'HTML',
                'CSS',
                'JavaScript'
            ],
            completed: true
        },
        {
            subject: 'WDD',
            number: 231,
            title: 'Frontend Web Development I',
            credits: 2,
            certificate: 'Web and Computer Programming',
            description: 'This course builds on prior experience with Dynamic Web Fundamentals and programming. Students will focus on user experience, accessibility, compliance, performance optimization, and basic API usage.',
            technology: [
                'HTML',
                'CSS',
                'JavaScript'
            ],
            completed: false
        }
    ];
    function displayCourses(courses) {
        document.querySelector("#certGrid").innerHTML = "";
        const container = document.querySelector("#certGrid");
        courses.forEach(course => {
            const card = document.createElement("div");
            card.classList.add("course-card");

            if (course.completed) {
                card.classList.add('completed');
            }
            card.innerHTML = `
            <h3>${course.subject} ${course.number}</h3>
            `;
            container.appendChild(card);
        });

        showTotal(courses);
    }

    displayCourses(courses);

    const allCourses = document.querySelector("#fullCourses");
    allCourses.addEventListener("click", () => {
        let all = courses.filter(course => course.subject);
        event.preventDefault();
        displayCourses(all);
    })

    const wddCourses = document.querySelector("#wddCourses");
    wddCourses.addEventListener("click", () => {
        let wdd = courses.filter(course => course.subject == "WDD");
        event.preventDefault();
        displayCourses(wdd);
    })

    const cseCourses = document.querySelector("#cseCourses");
    cseCourses.addEventListener("click", () => {
        let cse = courses.filter(course => course.subject == "CSE");
        event.preventDefault();
        displayCourses(cse);
    })
    
    function calcTotalCredits(courses) {
        return courses.reduce((sum, course) => sum + (Number(course.credits) || 0), 0);
    }

    function showTotal(courses) {
        const total = calcTotalCredits(courses);
        document.querySelector('#totalCredit').textContent = total;

    }
    function completedCourses(courses) {
        let completed = courses.filter(course => course.completed === "true");

    }

})