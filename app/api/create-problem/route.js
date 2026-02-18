import { currentUserRole, getCurrentUser } from "@/app/modules/auth/actions";
import { getJudge0LanguageId, pollBatchResult, submissionBatch } from "@/lib/judge0";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request){
   try {
    const userRole = await currentUserRole();
    const user = await getCurrentUser();
    if(userRole !== UserRole.ADMIN){
        return NextResponse.json({error:"Unauthorized"},{status:401})
    }
    const body = await request.json();
    const {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testCases,
        codeSnippets,
        referenceSolution,
    } = body;

    if (!title || !description || !difficulty || !testCases || !codeSnippets || !referenceSolution) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
   
    if(!Array.isArray(testCases) || testCases.length===0){
        return NextResponse.json(
        { error: "At least one test case is required" },
        { status: 400 }
      );
    }

    if(!referenceSolution || typeof referenceSolution !== 'object'){
        return NextResponse.json(
        { error: "Reference solutions must be provided for all supported languages" },
        { status: 400 }
      );
    }

    for(const [language,solutionCode] of Object.entries(referenceSolution)){
         const languageId = getJudge0LanguageId(language);
         if(!languageId){
            return NextResponse.json(
            {error:`Unsupported language ${language}`},
            {status:401}
            );
         }
         const submissions = testCases.map((tc)=>({
            source_code:solutionCode,
            language_id:languageId,
            stdin:tc.input,
            expected_output:tc.output
         }))
         const submissionResult = await submissionBatch(submissions)         // this is creating a submission and generating tokens    
         const tokens = submissionResult.map((res)=>res.token)
         const results = await pollBatchResult(tokens)

         for(let i=0;i<results.length;i++){
            const result = results[i];
            if(result.status.id !== 3){
                return NextResponse.json(
                    {
                        error:`Validation failed for ${language}`,
                        testCases:{
                            input: submissions[i].expected_output,
                            actualOutput: result.stdout,
                            error: result.stderr || result.compile_output,
                        },
                        details: result,
                    },
                    {status:400}
                );
            }
         }
    }

    const newProblem = await db.problem.create({
        data:{
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testCases,
        codeSnippets,
        referenceSolution,
        userId: user.id
        }
    })

    return NextResponse.json({
        success:true,
        message: "Problem created successfully",
        data: newProblem,
    },{status:201});

   } catch (dbError) {
    console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to save problem to database" },
        { status: 500 }
      );
   }
}