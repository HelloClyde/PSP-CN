template "Ext2/Ext3 Superblock"

// Created by Jens Kirschner on Sep 29, 2004
// X-Ways Software Technology AG

// The first superblock always starts at position 1024 regardless 
// of sector or block sizes on the system. There will be a copy of 
// it in every blockgroup of the drive, always as the first block 
// of the group, UNLESS the "sparse superblock feature" is set on 
// the drive. This is standard these days and will cause the 
// superblock copies to exist only in blockgroups 0, 1 and all 
// powers of 3, 5 and 7. The other blockgroups will neither have 
// superblocks nor group descriptor tables 


description "To be applied to offset 1024 of an Ext2/3 partition"
applies_to disk
sector-aligned

requires 0x38 "53 EF" // ext2 magic 

begin
	uint32	"Inode count"
	uint32	"Block count"
	uint32	"Reserved block count"
	uint32	"Free block count"
	uint32	"Free Inode count"
	uint32	"First data block"
	uint32	"Block size (0=1K, 1=2K, 2=4K)"
	int32		"Fragment size (same)"
	uint32	"Blocks per group"
	uint32	"Fragments per group"
	uint32	"Inodes per group"
	UNIXDateTime	"Last mount time"
	UNIXDateTime	"Last write time"
	uint16	"Mount count"
	int16		"Maximal mount count"
	hex 2		"Magic signature (53 EF)"
	uint16	"File system state"
	uint16	"Behavior when detecting errors"
	uint16	"Minor revision level"
	UNIXDateTime	"Time of last check"
	uint32	"Max. time between checks (sec)"
	uint32	"OS (0: Linux)"
	uint32	"Revision level"
	uint16	"Default uid for reserved blocks"
	uint16	"Default gid for reserved blocks"

	IfEqual "Revision level" 0
				// no extended superblock section
	Else
		section "Extended Superblock Section"	
		uint32	"First non-reserved Inode"
		uint16	"Inode size"
		uint16	"This superblock's block group"
		uint32	"Compatibility feature flags"
		uint32	"Incompatibility feature flags"
		uint32	"RO-compatibility feature flags"
		hex 16	"UUID of the volume"
		char[16]	"Volume name"
		move 68
		uint8		"Blocks preallocation"
		uint8		"Directory blocks preallocation"
		move 2
		hex 16	"Journal UUID"
		uint32	"Journal Inode"
		uint32	"Journal device #"
		uint32	"Last orphaned Inode"
		move 16
		uint8		"Hash version"
		move 3
		uint32	"Default mount options"
		uint32	"First metablock block group"
	EndIf
end