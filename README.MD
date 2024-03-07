# Web Multi Aligner / One to Many Sequence Aligner
This is a single-page web app to align short DNA sequences with minor differences to a shorter reference sequence using affine alignment.
### About
This web app was created while I was in a Recombinant DNA Techniques Lab (or The CRISPr Lab as I like to call it) and saw the number of steps and tools needed to take a bunch of long Sanger sequences, trim them to the relevant lengths, then align all of them, then determine how each sequence was different. I had recently learned alignment algorithms in another class, so I put that knowledge to use and build this webpage to combine all those steps into one, and show the result in a pretty way, highlighting the differences.
### Running
Open the index.html in a standard browser that supports JavaScript and CSS, and it should work. The CSS and JS are embedded within the HTML file, so it only requires the one file (and your browser) to run.
### Affine Alignment
Alignment typically takes two strings and finds the minimum number of changes to make to one string to get the other string. For example, comparing "I love cats!" with "I love dogs!" gives:
```diff
I love 
- cat
+ dog
s!
```
since none of the letters in cat and dog are the same, so all of those must change, but everything before and after them are the same.

For two strings of length n and k, Affine Alignment (and most alignments in general) take O(n\*k) time and space (there exist modifications of the algorithm that allow O(min(n,k)) space, but they take ~2x as long).
### Multi Aligner
This page does its best to align multiple lines with different changes all to each other, so that when displayed, letters that are the same should be vertically aligned. This is done by creating an alignment from each test string to the reference string, then building a second reference string including blanks for all insertions, so that on a second pass alignment with the second reference string, will leave spaces for all of the strings that had other strings added to them. This usually works to align many similar sequences visually. However, occasionally there will be an edge-case where this second alignment changes a delta to an insertion or vice versa leading to a line that doesn't line up correctly.

In this case, for aligning M strings of length n to a reference string of length k, this multi aligner will run the O(n\*k) affine alignment algorithm M times on the reference string, then M more times with the second reference string, that is typically still ~k length Theta(n\*k), but could in worst case become n+k, leading to O(n\*(n+k)) time. Thus, the multi aligner has worst case runtime of (2\*) O(M\*(n^2+n\*k)).

A true M-way alignment would require O(n^M) time and O(n^(M-1)) space, but would find the exact alignment for each string to every other string. This would be more accurate, but at a huge cost when M is on the order of hundreds to thousands or more.
