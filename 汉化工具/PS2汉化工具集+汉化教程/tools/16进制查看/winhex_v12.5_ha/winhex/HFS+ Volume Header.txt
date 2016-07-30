template "HFS+ Volume Header"
description "Located 1024 bytes from the start of the volume"

// Template by Stefan Fleischmann
// X-Ways Software Technology AG

// A copy of this volume header, the alternate volume header, is stored starting 1024 bytes before the end of the volume. 

big-endian
sector-aligned
applies_to disk
requires 0x0 "48 2B"

begin
	char[2]	signature
	UInt16	version
	UInt32	attributes
	UInt32	lastMountedVersion
	UInt32	journalInfoBlock
 
	AppleDateTime	createDate
	AppleDateTime	modifyDate
	AppleDateTime	backupDate
	AppleDateTime	checkedDate
 
	UInt32	fileCount
	UInt32	folderCount
 
	UInt32	blockSize
	UInt32	totalBlocks
	UInt32	freeBlocks
 
	UInt32	nextAllocation
	UInt32	rsrcClumpSize
	UInt32	dataClumpSize
	UInt32	nextCatalogID
 
	UInt32	writeCount
	Int64	encodingsBitmap
 
	UInt32[8]	finderInfo
 
	section "HFSPlusForkData allocationFile"
	Int64	logicalSize
	UInt32	clumpSize
	UInt32	totalBlocks
	{
	UInt32	startBlock
	UInt32	blockCount
	}[8]

	section "HFSPlusForkData extentsFile"
	Int64	logicalSize
	UInt32	clumpSize
	UInt32	totalBlocks
	{
	UInt32	startBlock
	UInt32	blockCount
	}[8]

	section "HFSPlusForkData catalogFile"
	Int64	logicalSize
	UInt32	clumpSize
	UInt32	totalBlocks
	{
	UInt32	startBlock
	UInt32	blockCount
	}[8]

	section "HFSPlusForkData attributesFile"
	Int64	logicalSize
	UInt32	clumpSize
	UInt32	totalBlocks
	{
	UInt32	startBlock
	UInt32	blockCount
	}[8]

	section "HFSPlusForkData startupFile"
	Int64	logicalSize
	UInt32	clumpSize
	UInt32	totalBlocks
	{
	UInt32	startBlock
	UInt32	blockCount
	}[8]
end