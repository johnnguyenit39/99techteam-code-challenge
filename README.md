# 99techteam Code Challenge

This technical test evaluates a candidate's ability to design, implement, and deliver backend functionality following best engineering practices. You will build a backend service that demonstrates skills in API design, data modeling, error handling, and clean, maintainable code.

## 📁 Repository Structure

```
.
├── README.md                 # This file - Overview and navigation
├── problem-4/               # Three Ways to Sum to n
│   ├── README.md           # Problem description and solution
│   ├── src/
│   │   └── sum-to-n.ts     # Implementation
│   └── tests/
│       └── sum-to-n.test.ts
├── problem-5/               # A Crude Server
│   ├── README.md           # Setup and run instructions
│   ├── src/                # Express server source code
│   └── package.json        # Dependencies
└── problem-6/               # Architecture
    ├── README.md           # Module specification
    └── diagram/            # Architecture diagrams
```

## 🚀 Quick Start

Each problem is self-contained in its own directory. Navigate to the problem folder and follow the instructions in its README.

### Problem 4: Three Ways to Sum to n
**Location:** [`problem-4/`](./problem-4/)  
**Category:** Backend | Fullstack  
**Duration:** ≤ 2 hours (internship) / significantly less (professional)

[View Problem Details →](./problem-4/README.md)

### Problem 5: A Crude Server
**Location:** [`problem-5/`](./problem-5/)  
**Category:** Backend | Fullstack  
**Duration:** ≤ 16 hours (internship) / significantly less (professional)

[View Problem Details →](./problem-5/README.md)

### Problem 6: Architecture
**Location:** [`problem-6/`](./problem-6/)  
**Category:** Backend | Fullstack  
**Duration:** ≤ 8 hours (internship) / significantly less (professional)

[View Problem Details →](./problem-6/README.md)

---

## 📋 Original Requirements

<details>
<summary>Click to view original problem statements</summary>

### Problem 4: Three Ways to Sum to n

Provide 3 unique implementations of the following function in TypeScript. Comment on the complexity or efficiency of each function.

- **Input:** `n` - any integer
- **Assumption:** This input will always produce a result less than `Number.MAX_SAFE_INTEGER`.
- **Output:** Return the summation to n, i.e., `sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15`.

### Problem 5: A Crude Server

Develop a backend server with ExpressJS. You are required to build a set of CRUD interfaces that allow a user to interact with the service. You are required to use TypeScript for this task.

**Interface functionalities:**
- Create a resource
- List resources with basic filters
- Get details of a resource
- Update resource details
- Delete a resource

**Additional requirements:**
- Connect your backend service with a simple database for data persistence
- Provide a `README.md` file with configuration instructions and the way to run the application

### Problem 6: Architecture

Write the specification for a software module on the API service (backend application server).

**Deliverables:**
1. Create documentation for this module in a `README.md` file
2. Create a diagram to illustrate the flow of execution
3. Add additional comments for improvements you may have in the documentation

**Software Requirements:**
- We have a website with a scoreboard that shows the top 10 users' scores
- We want live updates of the scoreboard
- Users can perform an action (which we do not need to care what the action is); completing this action will increase the user's score
- Upon completion, the action will dispatch an API call to the application server to update the score
- We want to prevent malicious users from increasing scores without authorization

</details>

---

## 🧪 Testing

![Testing Guidance](./testing_guidance.gif)

### Quick Start - Test All Problems

Run a single command to test all problems automatically:

```bash
npm test
```

This will:
- ✅ Run automated tests for Problem 4 (Jest tests)
- ✅ Start Problem 5 server and test all CRUD endpoints
- ✅ Display test results for both problems

### Test Individual Problems

```bash
# Test only Problem 4
npm run test:problem4

# Test only Problem 5
npm run test:problem5
```

### Manual Testing (Optional)

**Problem 4:**
```bash
cd problem-4
npm install  # First time only
npm test
```

**Problem 5:**
```bash
# Start server
npm run dev:problem5

# In another terminal, test endpoints
curl http://localhost:3000/health
curl http://localhost:3000/api/resources
# See problem-5/README.md for more examples
```

**Problem 6:**
This problem is documentation-based. Review the architecture documentation in [`problem-6/`](./problem-6/).

---

## 📝 Notes

- Each problem folder contains its own README with detailed instructions
- All solutions are implemented in TypeScript
- Test files are included where applicable
- Configuration files are provided for easy setup and running
